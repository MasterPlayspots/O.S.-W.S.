import {open,readFile,realpath} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve,dirname,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {fields,context,ident,text} from '../../web/modules/contracts.js';

const same=(a,b)=>a.id===b.id&&a.scope===b.scope;
const digest=value=>createHash('sha256').update(value).digest('hex');
export function validateMemory(value){
 fields(value,['schemaVersion','items'],'Memory');
 if(value.schemaVersion!==1||!Array.isArray(value.items)||value.items.length>1000)throw Error('Ungültiger Memory-Vertrag.');
 const ids=new Set();
 for(const item of value.items){
  fields(item,['id','title','content','source','updatedAt','tags'],'Memory-Eintrag');ident(item.id);
  if(ids.has(item.id))throw Error('Doppelte Memory-ID.');ids.add(item.id);
  text(item.title,160);text(item.content,8192);text(item.source,240);
  if(!Number.isFinite(Date.parse(item.updatedAt))||!Array.isArray(item.tags)||item.tags.length>12)throw Error('Ungültige Memory-Metadaten.');
  item.tags.forEach(tag=>text(tag,40));
 }
 return structuredClone(value.items);
}
export async function openRegistry({configFile=null,now=Date.now}={}){
 let configs=[];
 if(configFile){
  const bytes=await readFile(configFile);if(bytes.length>65536)throw Error('Verbindungsdatei zu groß.');
  const c=JSON.parse(bytes);fields(c,['schemaVersion','connections'],'Verbindungen');
  if(c.schemaVersion!==1||!Array.isArray(c.connections)||c.connections.length>20)throw Error('Ungültige Verbindungsdatei.');
  const ids=new Set();
  configs=c.connections.map(v=>{
   fields(v,['id','label','purpose','type','project','path','freshForSeconds'],'Verbindung');ident(v.id);text(v.label,80);text(v.purpose,240);context(v.project);
   if(ids.has(v.id)||v.type!=='memory-json'||typeof v.path!=='string'||!v.path.trim())throw Error('Unbekannter Adapter oder doppelte Verbindung.');ids.add(v.id);
   const freshForSeconds=v.freshForSeconds??300;
   if(!Number.isSafeInteger(freshForSeconds)||freshForSeconds<10||freshForSeconds>3600)throw Error('Ungültige Gültigkeitsdauer.');
   return {...v,freshForSeconds,path:resolve(dirname(resolve(configFile)),v.path)};
  });
 }
 const observations=new Map(),cached=new Map(),checking=new Set();
 function find(id,p){ident(id);context(p);const c=configs.find(x=>x.id===id&&same(x.project,p));if(!c)throw Error('Verbindung in diesem Kontext nicht vorhanden.');return c;}
 function describe(c){
  const o=observations.get(c.id)||null;
  return {id:c.id,label:c.label,purpose:c.purpose,type:c.type,source:basename(c.path),target:'workspace',direction:'source-to-workspace',permissions:['read'],capabilities:['memory.list','memory.search','memory.read'],
   status:o?(o.status==='healthy'&&now()>=Date.parse(o.validUntil)?'stale':o.status):'unverified',observation:o,checking:checking.has(c.id)};
 }
 async function check(id,p){
  const c=find(id,p);if(checking.has(id))throw Error('Prüfung läuft bereits.');checking.add(id);
  const start=now();let handle;
  try{
   // Explicit file binding, no browser-supplied path, symlink or directory scan.
   if(await realpath(c.path)!==c.path)throw Error('Symlink nicht erlaubt.');
   handle=await open(c.path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
   const info=await handle.stat();if(!info.isFile()||info.size>1048576)throw Error('Ungültige Memory-Datei.');
   const buffer=Buffer.alloc(1048577);let size=0;
   while(size<buffer.length){const r=await handle.read(buffer,size,buffer.length-size,null);if(!r.bytesRead)break;size+=r.bytesRead;}
   if(size>1048576)throw Error('Memory-Datei zu groß.');
   const bytes=buffer.subarray(0,size),items=validateMemory(JSON.parse(bytes.toString('utf8')));
   const sourceHash=digest(bytes);cached.set(id,items.map(item=>({...item,connectionId:id,sourceHash,contentHash:digest(item.content),quality:item.source.startsWith('example:')?'demo':'reported'})));
   const checkedAt=new Date(now()).toISOString();
   observations.set(id,{status:'healthy',checkedAt,validUntil:new Date(now()+c.freshForSeconds*1000).toISOString(),latencyMs:Math.max(0,now()-start),itemCount:items.length,sourceHash,message:'Gebundene Datei gelesen und Memory-Vertrag geprüft. Schreibzugriff ist deaktiviert.'});
  }catch{
   cached.delete(id);observations.set(id,{status:'error',checkedAt:new Date(now()).toISOString(),validUntil:null,latencyMs:Math.max(0,now()-start),itemCount:null,sourceHash:null,message:'Memory konnte nicht geprüft werden. Pfad, Leserechte, JSON-Vertrag, Größe und Symlinks am Host prüfen.'});
  }finally{await handle?.close();checking.delete(id);}
  return describe(c);
 }
 return {
  list(p){context(p);return configs.filter(c=>same(c.project,p)).map(describe);},check,
  query(p,{connectionId=null,q='',limit=50}={}){
   context(p);if(typeof q!=='string'||q.length>160||!Number.isSafeInteger(limit)||limit<1||limit>100)throw Error('Ungültige Suchanfrage.');
   const selected=connectionId?[find(connectionId,p)]:configs.filter(c=>same(c.project,p));const matches=[];
   for(const c of selected){const d=describe(c);for(const item of cached.get(c.id)||[]){if((item.title+' '+item.content+' '+item.tags.join(' ')).toLocaleLowerCase().includes(q.toLocaleLowerCase()))matches.push({...item,connectionStatus:d.status,checkedAt:d.observation?.checkedAt});}}
   return {items:matches.slice(0,limit),total:matches.length,limit,connections:selected.map(describe),searchKind:'local-text',modelContextInjected:false};
  },
  read(p,connectionId,itemId){const c=find(connectionId,p);ident(itemId);const item=cached.get(c.id)?.find(x=>x.id===itemId);if(!item)throw Error('Memory-Eintrag nicht vorhanden; Quelle zuerst prüfen.');return {...item,connectionStatus:describe(c).status,modelContextInjected:false};}
 };
}
