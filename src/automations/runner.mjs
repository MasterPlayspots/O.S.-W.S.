import {fields,ident,text} from '../../web/modules/contracts.js';
export function validateAutomation(a){
 fields(a,['id','version','title','trigger','action','status','maxSteps'],'Automation');ident(a.id);text(a.title,120);
 if(!Number.isSafeInteger(a.version)||a.version<1||!['tests.passed','review.requested'].includes(a.trigger)||!['report.prepare','review.prepare'].includes(a.action)||!['draft','active','paused','archived'].includes(a.status)||a.maxSteps!==1)throw Error('Nur ein lokaler Entwurfsschritt ist freigegeben.');
 return structuredClone(a);
}
export function previewAutomation(a){const v=validateAutomation(a);return {automation:v,externalActions:0,steps:[{action:v.action,effect:'Einen privaten lokalen Textentwurf aus referenzierten Metadaten speichern. Kein Versand, kein Teststart und kein Deployment.'}],requiresConfirmation:true};}
export function executeLocalAutomation(state,id,eventId,trigger){
 ident(eventId);const a=state.automations.find(x=>x.id===id);if(!a||a.status!=='active')throw Error('Automation ist nicht aktiv.');
 if(a.trigger!==trigger)throw Error('Auslöser passt nicht.');
 const key=id+':'+a.version+':'+eventId,existing=state.runs.find(r=>r.key===key);if(existing)return {duplicate:true,run:existing};
 if(state.runs.length>=200)throw Error('Lokales Laufarchiv voll.');
 const report={id:'report-'+(state.reports.length+1),automationId:id,eventId,createdAt:new Date().toISOString(),content:'Entwurf: '+a.title+'\nAuslöser: '+trigger+'\nQuelle: manuell geliefertes Ereignis '+eventId+'\nVor Nutzung fachlich prüfen. Keine externen Aktionen ausgeführt.'};
 const run={key,state:'completed',reportId:report.id,at:report.createdAt,externalActions:0};state.reports.push(report);state.runs.push(run);return {duplicate:false,run};
}
