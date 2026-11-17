import {readFile,writeFile,mkdir,rename,rm,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {EventEmitter} from 'node:events';
import {projectKey,ConflictError} from '../store.mjs';
import {validateLayout,context,fields,text,ident} from '../../web/modules/contracts.js';
import {defaultLayout} from './demo.mjs';
import {applyUsage} from '../model/usage.mjs';
const fresh=()=>({schemaVersion:1,revision:0,updatedAt:null,layout:defaultLayout(),drafts:{},sessions:[],tasks:[],usages:[],events:[],eventHashes:{},streams:{},history:[],automations:[],runs:[],reports:[]});
export async function openWorkspaceStore(root){
 await mkdir(root,{recursive:true,mode:0o700});const emitter=new EventEmitter();emitter.setMaxListeners(100);let queue=Promise.resolve();
 async function read(project){const path=join(root,projectKey(context(project))+'.json');try{if((await stat(path)).size>8*1024*1024)throw Error('Workspace-Speicher zu groß.');const s=JSON.parse(await readFile(path,'utf8'));validateLayout(s.layout);if(s.schemaVersion!==1||!Number.isSafeInteger(s.revision))throw Error('Workspace beschädigt.');return s;}catch(e){if(e.code==='ENOENT')return fresh();throw e;}}
 function change(project,type,fn,{baseRevision}={}){
  const key=projectKey(context(project));
  const task=queue.then(async()=>{
   const s=await read(project);
   if(baseRevision!==undefined&&s.revision!==baseRevision)throw new ConflictError(s.revision);
   const outcome=await fn(s);if(outcome?.unchanged)return s;
   s.revision++;s.updatedAt=new Date().toISOString();
   const event={cursor:s.revision,type,at:s.updatedAt,summary:type};s.events.push(event);s.events=s.events.slice(-300);
   s.history.push({id:'snapshot-'+s.revision,revision:s.revision,at:s.updatedAt,layout:structuredClone(s.layout),sessions:structuredClone(s.sessions),tasks:structuredClone(s.tasks),usages:structuredClone(s.usages),drafts:structuredClone(s.drafts)});
   s.history=s.history.slice(-40);
   const data=JSON.stringify(s);if(Buffer.byteLength(data)>8*1024*1024)throw Error('Workspace voll. Export und private Archivierung erforderlich.');
   const path=join(root,key+'.json'),tmp=path+'.'+randomUUID()+'.tmp';
   try{await writeFile(tmp,data,{flag:'wx',mode:0o600});await rename(tmp,path);}finally{await rm(tmp,{force:true});}
   emitter.emit(key,event);return s;
  });queue=task.catch(()=>{});return task;
 }
 return {read,change,
  saveLayout(project,layout,baseRevision){
   if(!Number.isSafeInteger(baseRevision)||baseRevision<0)throw Error('Basisrevision fehlt.');
   const valid=validateLayout(layout);return change(project,'layout.saved',s=>s.layout=valid,{baseRevision});
  },
  saveDraft(project,fileId,content,baseRevision){
   text(fileId,160);if(['__proto__','constructor','prototype'].includes(fileId))throw Error('Ungültige Datei-ID.');if(typeof content!=='string'||Buffer.byteLength(content)>65536)throw Error('Entwurf überschreitet 64 KiB.');
   return change(project,'draft.saved',s=>{s.drafts[fileId]={content,version:s.revision+1,updatedAt:new Date().toISOString()};},{baseRevision});
  },
  ingest(project,input){
   fields(input,['eventId','streamId','sequence','schemaVersion','occurredAt','type','payload'],'Ereignis');ident(input.eventId);ident(input.streamId);
   if(input.schemaVersion!==1||!Number.isSafeInteger(input.sequence)||input.sequence<1||!Number.isFinite(Date.parse(input.occurredAt)))throw Error('Event-Schema/Sequenz ungültig.');
   const hash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
   return change(project,'source.'+input.type,s=>{
    if(s.eventHashes[input.eventId]){if(s.eventHashes[input.eventId]!==hash)throw Error('Event-ID wurde mit anderem Inhalt wiederverwendet.');return {unchanged:true};}
    if(Object.keys(s.eventHashes).length>=10000)throw Error('Eventkapazität erreicht. Vor Archivierung stoppen.');
    if(input.sequence!==(s.streams[input.streamId]||0)+1)throw Error('Stream-Lücke: erwartete Sequenz '+((s.streams[input.streamId]||0)+1));
    if(input.type==='usage.snapshot'||input.type==='usage.delta'){
     if(input.payload.kind!==input.type.split('.')[1])throw Error('Usage-Typ stimmt nicht überein.');
     if(!s.sessions.some(x=>x.id===input.payload.sessionId))throw Error('Session zuerst registrieren.');
     s.usages=applyUsage(s.usages,input.payload);
    }else if(input.type==='session.upsert'){
     const p=input.payload;fields(p,['id','taskId','agent','runtime','provider','requestedModelId','effectiveModelId','state','contextUsed','contextLimit','capabilities','startedAt','heartbeatAt','quality','nextStep','branch'],'Session');
     ident(p.id);for(const k of ['agent','runtime','provider','nextStep','branch'])if(p[k]!==null)text(p[k],200);
     for(const k of ['taskId','requestedModelId','effectiveModelId'])if(p[k]!==null)text(p[k],160);
     if(!['ready','running','waiting','review','completed','failed','cancelled'].includes(p.state)||!['reported','estimated'].includes(p.quality)||!Array.isArray(p.capabilities)||p.capabilities.length)throw Error('Sessionstatus ungültig; dieser Adapter ist nur lesend.');
     for(const k of ['contextUsed','contextLimit'])if(p[k]!==null&&(!Number.isSafeInteger(p[k])||p[k]<0))throw Error('Kontext ungültig.');
     for(const k of ['startedAt','heartbeatAt'])if(p[k]!==null&&!Number.isFinite(Date.parse(p[k])))throw Error('Sessionzeit ungültig.');
     const old=s.sessions.findIndex(x=>x.id===p.id);if(old<0){if(s.sessions.length>=100)throw Error('Sessionlimit erreicht.');s.sessions.push(structuredClone(p));}else s.sessions[old]=structuredClone(p);
    }else if(input.type==='task.upsert'){
     const p=input.payload;fields(p,['id','title','status','acceptedCount','eligibleCount','quality'],'Aufgabe');ident(p.id);text(p.title,200);
     if(!['planned','in_progress','blocked','review','accepted','cancelled'].includes(p.status)||p.quality!=='reported')throw Error('Aufgabenstatus ungültig.');
     if(!Number.isSafeInteger(p.acceptedCount)||!Number.isSafeInteger(p.eligibleCount)||p.acceptedCount<0||p.eligibleCount<p.acceptedCount)throw Error('Aufgabenfortschritt ungültig.');
     const i=s.tasks.findIndex(t=>t.id===p.id);if(i<0){if(s.tasks.length>=300)throw Error('Aufgabenlimit erreicht.');s.tasks.push(structuredClone(p));}else s.tasks[i]=structuredClone(p);
    }else throw Error('Ereignistyp nicht erlaubt.');
    s.eventHashes[input.eventId]=hash;s.streams[input.streamId]=input.sequence;
   });
  },
  subscribe(project,fn){const key=projectKey(project);emitter.on(key,fn);return()=>emitter.off(key,fn);},
  async close(){await queue;emitter.removeAllListeners();}
 };
}
