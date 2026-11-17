import {fields,text,ident} from '../../web/modules/contracts.js';
const counters=['input','output','cacheRead','cacheWrite','reasoning','providerTotal'];
const nullableCount=v=>v===null||(Number.isSafeInteger(v)&&v>=0);
export function validateUsage(r){
 fields(r,['requestId','attemptId','sessionId','modelId','revision','final','kind',...counters,'totalSemantics','cost','source','quality','observedAt'],'Usage');
 for(const k of ['requestId','attemptId','sessionId'])ident(r[k]);if(r.modelId!==null)text(r.modelId,160);
 if(!Number.isSafeInteger(r.revision)||r.revision<1||typeof r.final!=='boolean'||!['snapshot','delta'].includes(r.kind))throw Error('Invalid usage revision or type.');
 for(const k of counters)if(!nullableCount(r[k]))throw Error('Unknown or negative usage counts must be represented as null.');
 if(!['provider_reported','disjoint_io','unknown'].includes(r.totalSemantics)||!['reported','estimated','demo'].includes(r.quality))throw Error('Usage provenance is missing.');
 text(r.source,160);if(!Number.isFinite(Date.parse(r.observedAt)))throw Error('Usage timestamp is missing.');
 if(r.cost!==null){fields(r.cost,['value','currency','quality','priceVersion'],'Costs');if(!Number.isFinite(r.cost.value)||r.cost.value<0||!['EUR','USD'].includes(r.cost.currency)||!['reported','estimated','demo'].includes(r.cost.quality))throw Error('Invalid costs.');text(r.cost.priceVersion,100);}
 return structuredClone(r);
}
export function applyUsage(records,input){
 const r=validateUsage(input),key=x=>x.requestId+':'+x.attemptId;
 const index=records.findIndex(x=>key(x)===key(r)),old=records[index];
 if(old&&(old.sessionId!==r.sessionId||old.modelId!==r.modelId||old.source!==r.source))throw Error('Request associations must not change.');
 if(old&&r.revision<=old.revision)return records;
 if(old?.final&&!r.final)return records;
 let next=r;
 if(r.kind==='delta'&&old){
  if(old.final)throw Error('Delta rejected after a final snapshot.');
  if(r.revision!==old.revision+1)throw Error('Delta gap: provide a new snapshot.');
  next={...r};for(const k of counters)next[k]=old[k]===null||r[k]===null?null:old[k]+r[k];
  if(old.cost&&r.cost&&old.cost.currency===r.cost.currency&&old.cost.priceVersion===r.cost.priceVersion)next.cost={...r.cost,value:old.cost.value+r.cost.value};
  else next.cost=null;
  for(const k of counters)if(!nullableCount(next[k]))throw Error('Usage count is outside the safe integer range.');
  next.kind='snapshot';
 }else if(r.kind==='delta')throw Error('The first usage record must be a snapshot.');
 const result=records.slice();if(index<0)result.push(next);else result[index]=next;return result;
}
export function aggregateUsage(records,{sessionId=null,from=null,to=null}={}){
 const filtered=records.filter(r=>(!sessionId||r.sessionId===sessionId)&&(!from||Date.parse(r.observedAt)>=Date.parse(from))&&(!to||Date.parse(r.observedAt)<=Date.parse(to)));
 const totals=filtered.map(r=>r.providerTotal!==null?r.providerTotal:r.totalSemantics==='disjoint_io'&&r.input!==null&&r.output!==null?r.input+r.output:null);
 const coverage=totals.filter(v=>v!==null).length;
 const currencies={};for(const r of filtered)if(r.cost){const key=r.cost.currency+':'+r.cost.quality;currencies[key]=(currencies[key]||0)+r.cost.value;}
 return {requests:filtered.length,knownRequests:coverage,total:filtered.length&&coverage===filtered.length?totals.reduce((a,b)=>a+b,0):null,
 knownSubtotal:totals.filter(v=>v!==null).reduce((a,b)=>a+b,0),input:sum('input'),output:sum('output'),currencies,missingCost:filtered.filter(r=>!r.cost).length};
 function sum(k){return filtered.length&&filtered.every(r=>r[k]!==null)?filtered.reduce((n,r)=>n+r[k],0):null;}
}
