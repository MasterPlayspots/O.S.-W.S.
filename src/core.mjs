/** Pure planning only. This module never executes actions or grants permissions. */
import { createHash } from 'node:crypto';

const CAPABILITIES = Object.freeze({
  'project.metadata.read': { title: 'Projektüberblick', widget: 'project-summary' },
  'tasks.read': { title: 'Nächste Aufgabe', widget: 'task-focus' },
  'calendar.read': { title: 'Zeit und Termine', widget: 'calendar' },
  'messages.read': { title: 'Kommunikation', widget: 'inbox' },
  'files.read': { title: 'Arbeitsmaterial', widget: 'files' },
  'metrics.read': { title: 'Kennzahlen', widget: 'metrics' },
  'model.execute': { title: 'KI-Arbeitsplatz', widget: 'agent-chat' }
});
const fail = message => { throw new Error(message); };
const id = value => typeof value === 'string' && /^[a-zA-Z0-9._-]{1,80}$/.test(value);
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const clone = value => structuredClone(value);
const timestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
function unknownKeys(value, allowed, label) {
  if (!object(value) || Object.keys(value).some(k => !allowed.includes(k))) fail(`Invalid ${label} fields`);
}
function scope(project) {
  unknownKeys(project,['id','scope'],'project');
  if (!id(project.id) || !['private','business'].includes(project.scope)) fail('Invalid project scope');
}

export function validatePreferences(p) {
  unknownKeys(p,['project','goals','focus','appearance','pinnedCapabilities'],'preferences');
  scope(p.project);
  if (!Array.isArray(p.goals) || !p.goals.length || p.goals.length > 20) fail('Provide 1–20 goals');
  const seen=new Set();
  for (const g of p.goals) {
    unknownKeys(g,['capability','priority'],'goal');
    if (!Object.hasOwn(CAPABILITIES,g.capability) || seen.has(g.capability)) fail('Unknown or repeated capability');
    if (!Number.isInteger(g.priority) || g.priority<0 || g.priority>100) fail('Invalid goal priority');
    seen.add(g.capability);
  }
  unknownKeys(p.focus,['visibleLimit','notifications','reducedMotion'],'focus');
  if (!Number.isInteger(p.focus.visibleLimit)||p.focus.visibleLimit<1||p.focus.visibleLimit>6) fail('Visible limit must be 1–6');
  if (!['quiet','digest'].includes(p.focus.notifications)||typeof p.focus.reducedMotion!=='boolean') fail('Invalid focus preferences');
  unknownKeys(p.appearance,['theme','glass','depth'],'appearance');
  if(!['black-glass','uniforce'].includes(p.appearance.theme)||!Number.isFinite(p.appearance.glass)||p.appearance.glass<0||p.appearance.glass>100||!Number.isFinite(p.appearance.depth)||p.appearance.depth<0||p.appearance.depth>100) fail('Invalid appearance');
  if (!Array.isArray(p.pinnedCapabilities)||new Set(p.pinnedCapabilities).size!==p.pinnedCapabilities.length||p.pinnedCapabilities.some(c=>!seen.has(c))) fail('Invalid pinned capabilities');
  if(p.pinnedCapabilities.length>p.focus.visibleLimit) fail('Pinned elements exceed the visible limit');
  return clone(p);
}

export function validateInventory(input) {
  unknownKeys(input,['project','sourceMode','services'],'inventory'); scope(input.project);
  if(!['synthetic_fixture','project_metadata','declared_inventory'].includes(input.sourceMode)) fail('Invalid source mode');
  if(!Array.isArray(input.services)||input.services.length>100) fail('Invalid services');
  const ids=new Set();
  for(const s of input.services) {
    unknownKeys(s,['id','kind','status','capabilities','observedAt','expiresAt','evidence'],'service');
    if(!id(s.id)||ids.has(s.id)) fail('Invalid or duplicate service id'); ids.add(s.id);
    if(!['local','mcp','api','manual'].includes(s.kind)||!['declared_ready','needs_auth','unavailable'].includes(s.status)) fail('Invalid service status');
    if(!Array.isArray(s.capabilities)||!s.capabilities.length||s.capabilities.some(c=>!Object.hasOwn(CAPABILITIES,c))) fail('Invalid service capabilities');
    if(!timestamp(s.observedAt)||!timestamp(s.expiresAt)||Date.parse(s.expiresAt)<=Date.parse(s.observedAt)) fail('Invalid observation lifetime');
    if(typeof s.evidence!=='string'||s.evidence.length>300) fail('Invalid evidence label');
  }
  return clone(input);
}

/** Hard-coded, closed action catalog. Decisions are advisory; no executor exists. */
export function actionDecision(action) {
  if(['inventory.summarize','layout.draft','connector.plan'].includes(action)) return {action,decision:'local_plan_only',executes:false};
  if(['connector.install','account.authorize','message.send','data.delete','code.deploy','permission.change','purchase','contract.sign'].includes(action)) return {action,decision:'requires_authorized_executor',executes:false};
  return {action,decision:'unknown_action_denied',executes:false};
}

function gapFor(capability, services, now) {
  const matching=services.filter(s=>s.capabilities.includes(capability));
  const fresh=matching.filter(s=>Date.parse(s.observedAt)<=now && Date.parse(s.expiresAt)>now);
  const ready=fresh.filter(s=>s.status==='declared_ready').sort((a,b)=>a.id.localeCompare(b.id))[0];
  if(ready) return {status:'declared_available',serviceId:ready.id,evidence:ready.evidence};
  const auth=fresh.find(s=>s.status==='needs_auth');
  if(auth) return {status:'needs_auth',serviceId:auth.id,evidence:auth.evidence};
  if(matching.length && !fresh.length) return {status:'stale',serviceId:null,evidence:'Observation expired or dated in the future'};
  return {status:'missing',serviceId:null,evidence:'No currently declared capability available'};
}

function connectorTask(capability,resolution) {
  const steps=resolution.status==='needs_auth'
    ? ['Anbieter und benötigte Leserechte prüfen','Anmeldung durch Kontoinhaber','Fähigkeiten erneut lesen und Verbindung testen']
    : resolution.status==='stale'
      ? ['Freigegebene Quelle erneut prüfen','Aktuelle Fähigkeiten und Authentifizierung bestätigen']
      : ['Vorhandene eigene Adapter prüfen','Offizielle Anbieterquelle und MCP-Registry nach Kandidaten prüfen','Herkunft, Version, Funktionsumfang und Rechte bewerten','Ohne MCP: dokumentierte API prüfen','Falls API vorhanden: Adapterentwurf und Tests vorbereiten','Ohne geeignete API: manuellen Import oder ausdrücklich freigegebene Browserbedienung anbieten'];
  return {id:'connect-'+capability,capability,status:resolution.status,steps,automaticInstallation:false,execution:actionDecision('connector.install')};
}

export function buildPlan({inventory,preferences,now=Date.now()}) {
  const i=validateInventory(inventory),p=validatePreferences(preferences);
  if(!Number.isFinite(now)) fail('Invalid evaluation time');
  if(i.project.id!==p.project.id||i.project.scope!==p.project.scope) fail('Inventory belongs to another project or scope');
  const pinned=new Set(p.pinnedCapabilities);
  const ordered=[...p.goals].sort((a,b)=>Number(pinned.has(b.capability))-Number(pinned.has(a.capability))||b.priority-a.priority||a.capability.localeCompare(b.capability));
  const dots=ordered.map(g=>({
    id:'dot-'+g.capability,capability:g.capability,title:CAPABILITIES[g.capability].title,widget:CAPABILITIES[g.capability].widget,
    priority:g.priority,pinned:pinned.has(g.capability),resolution:gapFor(g.capability,i.services,now),
    reason:`Vom Nutzer mit Priorität ${g.priority} angegeben${pinned.has(g.capability)?'; fest angeheftet':''}`
  }));
  const visible=dots.slice(0,p.focus.visibleLimit),deferred=dots.slice(p.focus.visibleLimit);
  const connectorTasks=dots.filter(d=>d.resolution.status!=='declared_available').map(d=>connectorTask(d.capability,d.resolution));
  const graph={nodes:[{id:'project-'+p.project.id,type:'Project',scope:p.project.scope},...i.services.map(s=>({id:'service-'+s.id,type:'Service',evidence:s.evidence})),...dots.map(d=>({id:d.id,type:'DOT',capability:d.capability}))],edges:dots.flatMap(d=>[{from:'project-'+p.project.id,to:d.id,type:'contains'},...(d.resolution.serviceId?[{from:d.id,to:'service-'+d.resolution.serviceId,type:'declared_binding'}]:[])])};
  const plan={schemaVersion:'0.1',mode:'plan_only',sourceMode:i.sourceMode,project:p.project,generatedAt:new Date(now).toISOString(),
    autonomy:{reasoning:'deterministic_rules',externalActionsExecuted:0,modelConnected:false,actions:['inventory.summarize','layout.draft','connector.plan'].map(actionDecision)},
    appearance:p.appearance,focus:{...p.focus,rearrangeDuringWork:false,objective:'Nutzerziele mit wenig sichtbaren Elementen; keine gemessene Produktivitätsgarantie'},
    views:{desktop:{layout:'grid',visible:visible.map(d=>d.id),drawer:deferred.map(d=>d.id)},mobile:{layout:'stack',primary:visible[0].id,secondary:visible.slice(1).map(d=>d.id),drawer:deferred.map(d=>d.id)}},
    dots,graph,connectorTasks,nextQuestion:connectorTasks.length?'Welche dieser Quellen möchtest du als erste verbinden?':'Passt diese Reihenfolge zu deinem nächsten Arbeitsschritt?',
    journal:[{type:'inventory.accepted',sourceMode:i.sourceMode},{type:'goals.prioritized',count:dots.length},{type:'layout.proposed',visible:visible.length},{type:'connector.gaps',count:connectorTasks.length}]};
  const signature={...plan,generatedAt:undefined};
  plan.id=createHash('sha256').update(JSON.stringify(signature)).digest('hex').slice(0,24);
  return plan;
}
