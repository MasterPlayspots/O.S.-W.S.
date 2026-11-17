import {randomUUID,createHash} from 'node:crypto';
import {join} from 'node:path';
import {fields,context,validateLayout,proposeLayout,text} from '../../web/modules/contracts.js';
import {openWorkspaceStore} from './store.mjs';
import {demoData,demoFiles} from './demo.mjs';
import {aggregateUsage,applyUsage} from '../model/usage.mjs';
import {previewAutomation,validateAutomation,executeLocalAutomation} from '../automations/runner.mjs';
import {createRepoReader} from '../adapters/local-repo.mjs';
import {createCodexPlanner} from '../model/codex-planner.mjs';
import {ConflictError,projectKey} from '../store.mjs';
export async function createWorkspaceApi({dataDir,projectRoot=null,allowFileWrite=false,enableCodexPlanner=false,repoProject={id:'workspace-core',scope:'business'}}){
 const store=await openWorkspaceStore(join(dataDir,'workspaces')),reader=projectRoot?await createRepoReader(projectRoot,{allowWrite:allowFileWrite}):null;
 const planner=createCodexPlanner({enabled:enableCodexPlanner});const streams=new Set(),previews=new Map();let planningProject=null;
 const digest=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
 const parseProject=url=>context({id:url.searchParams.get('project'),scope:url.searchParams.get('scope')});
 const repoAllowed=p=>projectKey(p)===projectKey(repoProject);
 const mode=url=>url.searchParams.get('mode')==='demo'?'demo':'connected';
 function liveData(s,p){return {title:p.id,milestone:'Ausgewählte Quellen',sessions:s.sessions,tasks:s.tasks,usages:s.usages,files:{},source:{id:'bridge',quality:s.sessions.length?'reported':'unknown',state:s.sessions.length?'imported':'missing',observedAt:s.updatedAt},events:s.events};}
 function summary(s,p,m){
  return {revision:s.revision,updatedAt:s.updatedAt,layout:s.layout,drafts:s.drafts,
   data:m==='demo'?demoData():liveData(s,p),sourceMode:m,
   repo:repoAllowed(p)?reader?.getSnapshot()||null:null,
   history:s.history.map(h=>({id:h.id,revision:h.revision,at:h.at})),
   automations:s.automations,runs:s.runs,reports:s.reports,
   capabilities:{localOnly:true,fileWrite:repoAllowed(p)&&allowFileWrite,sessionControl:false,externalAutomations:false},
   sourceGaps:['Controls/A12: kein freigegebener Adapter eingerichtet','Kalender und Kommunikation: nicht verbunden']};
 }
 async function handle({req,res,url,input,send}){
  const path=url.pathname;if(!['/api/workspace','/api/workspace/layout','/api/files/content','/api/files/draft','/api/files/apply','/api/local/read','/api/connections','/api/events','/api/events/ingest','/api/usage','/api/history','/api/assistant/propose','/api/assistant/cancel','/api/automation/preview','/api/automation/save','/api/automation/activate','/api/automation/run','/api/session/command'].includes(path))return false;
  let project;
  if(req.method==='GET')project=parseProject(url);
  else {project=context(input?.project);}
  const m=mode(url);
  if(req.method==='GET'&&path==='/api/workspace'){send(200,summary(await store.read(project),project,m));return true;}
  if(req.method==='GET'&&path==='/api/connections'){send(200,{planner:await planner.status(),repoConfigured:!!reader&&repoAllowed(project),runtimeBridge:{state:'ready',capabilities:['session.metadata.ingest','usage.ingest','task.ingest'],localOnly:true},controls:{state:'missing',reason:'Verifizierter Controls-Vertrag und Leserechte fehlen.'}});return true;}
  if(req.method==='GET'&&path==='/api/usage'){
   const s=await store.read(project),from=url.searchParams.get('from'),to=url.searchParams.get('to');
   if([from,to].some(v=>v&&!Number.isFinite(Date.parse(v)))||(from&&to&&Date.parse(from)>Date.parse(to)))throw Error('Ungültiger Zeitraum.');
   send(200,aggregateUsage(m==='demo'?demoData().usages:s.usages,{sessionId:url.searchParams.get('session'),from,to}));return true;
  }
  if(req.method==='GET'&&path==='/api/history'){
   const s=await store.read(project),id=url.searchParams.get('at');
   if(!id){send(200,{snapshots:s.history.map(h=>({id:h.id,revision:h.revision,at:h.at}))});return true;}
   const h=s.history.find(x=>x.id===id);if(!h){send(404,{error:'Snapshot nicht vorhanden oder nicht mehr im lokalen Verlauf.'});return true;}
   send(200,{...h,viewMode:'replay',missingVersions:['Nicht als Entwurf gespeicherte Dateiinhalte','Externe Transkripte und Terminalzustände'],liveRevision:s.revision});return true;
  }
  if(req.method==='GET'&&path==='/api/files/content'){
   const id=url.searchParams.get('fileId');text(id,160);
   if(m==='demo'&&Object.hasOwn(demoFiles,id)){send(200,{id,...demoFiles[id]});return true;}
   if(!reader||!repoAllowed(project)){send(403,{error:'Kein ausgewähltes Repo für diesen Kontext.'});return true;}
   send(200,await reader.read(id));return true;
  }
  if(req.method==='GET'&&path==='/api/events'){
   const after=Number(url.searchParams.get('after')||0);if(!Number.isSafeInteger(after)||after<0)throw Error('Ungültiger Ereigniscursor.');
   if(streams.size>=24){send(429,{error:'Zu viele offene Ereignisverbindungen.'});return true;}
   // Subscribe before reading so changes during the snapshot read are not missed.
   const buffered=[];let ready=false;
   const write=e=>{if(!res.destroyed)res.write('data: '+JSON.stringify(e)+'\n\n');};
   const unsubscribe=store.subscribe(project,e=>ready?write(e):buffered.push(e));
   let s;try{s=await store.read(project);}catch(e){unsubscribe();throw e;}
   res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive','X-Accel-Buffering':'no'});req.setTimeout(0);res.setTimeout(0);
   if((s.events.length&&after<s.events[0].cursor-1)||after>s.revision)write({type:'resync',cursor:s.revision});
   else for(const e of s.events)if(e.cursor>after)write(e);
   ready=true;for(const e of buffered)if(e.cursor>s.revision)write(e);
   write({type:'connected',cursor:s.revision,at:new Date().toISOString()});
   const beat=setInterval(()=>write({type:'heartbeat',cursor:null,at:new Date().toISOString()}),15000);
   const close=()=>{clearInterval(beat);unsubscribe();streams.delete(res);};streams.add(res);res.on('close',close);return true;
  }
  if(req.method!=='POST'){send(405,{error:'Methode nicht erlaubt.'});return true;}
  if(path==='/api/workspace/layout'){
   fields(input,['project','layout','baseRevision']);send(200,summary(await store.saveLayout(project,input.layout,input.baseRevision),project,m));return true;
  }
  if(path==='/api/files/draft'){
   fields(input,['project','fileId','content','baseRevision']);if(!Number.isSafeInteger(input.baseRevision))throw Error('Basisrevision fehlt.');
   send(200,summary(await store.saveDraft(project,input.fileId,input.content,input.baseRevision),project,m));return true;
  }
  if(path==='/api/local/read'){
   fields(input,['project']);if(!reader||!repoAllowed(project)){send(403,{error:'Repo muss am Start für diesen Projekt-/Scope-Kontext freigegeben sein.'});return true;}
   const repo=await reader.refresh();send(200,{repo});return true;
  }
  if(path==='/api/files/apply'){
   fields(input,['project','fileId','content','baseHash']);
   if(!reader||!repoAllowed(project)){send(403,{error:'Kein freigegebenes Repo.'});return true;}
   send(200,await reader.write(input.fileId,input.content,input.baseHash));return true;
  }
  if(path==='/api/events/ingest'){fields(input,['project','event']);send(200,summary(await store.ingest(project,input.event),project,m));return true;}
  if(path==='/api/assistant/propose'){
   fields(input,['project','layout','pageId','goal','style','useModel','focusId','baseRevision']);
   const s=await store.read(project);if(s.revision!==input.baseRevision)throw new ConflictError(s.revision);
   const layout=validateLayout(input.layout);text(input.goal,1200);
   if(typeof input.useModel!=='boolean'||!['balanced','focus'].includes(input.style))throw Error('Ungültiger Vorschlagsmodus.');
   let explanation={style:input.style,reason:input.style==='focus'?'Ein großer Fokus, weitere Fenster geordnet daneben.':'Gleichmäßiges Raster mit geschützten Pins.',source:'deterministic_rules',quality:'estimated',modelId:null,usage:null,cost:null};
   let receipt=null,contextChanged=false;
   if(input.useModel){
    const p=layout.pages.find(p=>p.id===input.pageId);if(!p)throw Error('Seite fehlt.');
    if(planningProject)throw Error('Ein Planungsauftrag ist bereits aktiv.');
    planningProject=projectKey(project);
    try{
     explanation=await planner.propose({goal:input.goal,windows:p.windows});
     const at=new Date().toISOString(),requestId='layout-'+randomUUID();
     receipt=await store.change(project,'planner.completed',current=>{
      contextChanged=current.revision!==s.revision;
      const session={id:'layout-planner',taskId:null,agent:'Layoutberater',runtime:'Codex CLI',provider:'Codex CLI account',requestedModelId:null,effectiveModelId:explanation.modelId,state:'completed',contextUsed:null,contextLimit:null,capabilities:[],startedAt:null,heartbeatAt:at,quality:'reported',nextStep:'Vorschlag prüfen und übernehmen',branch:null};
      const i=current.sessions.findIndex(x=>x.id===session.id);if(i<0)current.sessions.push(session);else current.sessions[i]=session;
      current.usages=applyUsage(current.usages,{requestId,attemptId:'1',sessionId:session.id,modelId:explanation.modelId,revision:1,final:true,kind:'snapshot',input:explanation.usage?.input??null,output:explanation.usage?.output??null,cacheRead:explanation.usage?.cacheRead??null,cacheWrite:null,reasoning:null,providerTotal:null,totalSemantics:'disjoint_io',cost:null,source:'codex-cli-layout',quality:'reported',observedAt:at});
     });
    }finally{planningProject=null;}
   }
   const proposed=proposeLayout(layout,input.pageId,{focusId:input.focusId,style:explanation.style});
   // A proposal never mutates the layout or starts a coding session.
   send(200,{layout:proposed,baseRevision:receipt?.revision??s.revision,explanation,externalActions:0,contextChanged,...(receipt?{snapshot:summary(receipt,project,m)}:{})});return true;
  }
  if(path==='/api/assistant/cancel'){
   fields(input,['project']);if(planningProject&&planningProject!==projectKey(project))throw Error('Lauf gehört zu anderem Kontext.');
   planner.cancel();send(200,{cancellationRequested:true});return true;
  }
  if(path==='/api/session/command'){send(403,{error:'Dieser Adapter importiert nur Metadaten. Sessionsteuerung/Terminal ist nicht freigegeben.'});return true;}
  if(path==='/api/automation/preview'){
   fields(input,['project','automation']);const preview=previewAutomation(input.automation),previewId=randomUUID();
   if(previews.size>=100)previews.delete(previews.keys().next().value);
   previews.set(previewId,{project:projectKey(project),hash:digest(preview.automation),expires:Date.now()+300000});
   send(200,{...preview,previewId});return true;
  }
  if(path==='/api/automation/save'||path==='/api/automation/activate'){
   fields(input,path.endsWith('/activate')?['project','automation','baseRevision','previewId']:['project','automation','baseRevision']);if(!Number.isSafeInteger(input.baseRevision))throw Error('Basisrevision fehlt.');
   const a=validateAutomation(input.automation);
   if(path.endsWith('/activate')){
    const ticket=previews.get(input.previewId);
    if(a.status!=='active'||!ticket||ticket.project!==projectKey(project)||ticket.hash!==digest(a)||ticket.expires<Date.now())throw Error('Passende, aktuelle Vorschau für diese Aktivierung erforderlich.');
   }else if(a.status==='active')throw Error('Aktivierung benötigt Vorschau und /api/automation/activate.');
   const s=await store.change(project,'automation.saved',s=>{
    const old=s.automations.findIndex(x=>x.id===a.id);
    if(old>=0){if(a.version!==s.automations[old].version+1)throw Error('Neue Automationsversion erforderlich.');s.automations[old]=a;}
    else{if(a.version!==1||s.automations.length>=30)throw Error('Automation ist ungültig oder Limit erreicht.');s.automations.push(a);}
   },{baseRevision:input.baseRevision});
   if(path.endsWith('/activate'))previews.delete(input.previewId);
   send(200,summary(s,project,m));return true;
  }
  if(path==='/api/automation/run'){
   fields(input,['project','automationId','eventId','trigger','viewMode']);
   if(input.viewMode!=='live')throw Error('Im Verlauf sind Aktionen gesperrt.');
   const s=await store.change(project,'automation.ran',s=>{const r=executeLocalAutomation(s,input.automationId,input.eventId,input.trigger);if(r.duplicate)return {unchanged:true};});
   send(200,summary(s,project,m));return true;
  }
  send(404,{error:'Unbekannte Operation.'});return true;
 }
 return {handle,async close(){planner.close();for(const res of streams)res.end();await store.close();}};
}
