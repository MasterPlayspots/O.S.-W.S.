import {$,node,button,field,detail,datetime} from './ui.js';
const labels={healthy:'Checked',error:'Error',stale:'Check again',unverified:'Unchecked',waiting:'Waiting for import',disabled:'Disabled',imported:'Import available',detected:'Detected · unverified',ready:'Run verified',blocked:'Blocked',unavailable:'Unavailable',missing:'Not connected'};
export function createIntegrationViews({api,state,error,render,download,switchView}){
 let generation=0;
 const contextKey=()=>state.context.scope+'/'+state.context.id;
 const pill=status=>node('span',{class:'connection-status '+status},node('i',{'aria-hidden':'true'}),labels[status]||status);
 const card=(title,status,description,...children)=>node('article',{class:'connection-card'},node('div',{class:'section-header'},node('h3',{},title),pill(status)),node('p',{class:'muted'},description),...children);
 function clear(){generation++;$('#connections-panel').replaceChildren();$('#memory-panel').replaceChildren();}
 async function show(view){
  const token=++generation,key=contextKey(),target=$(view==='memory'?'#memory-panel':'#connections-panel');
  target.replaceChildren(node('p',{class:'muted'},'Loading sources for the selected context …'));
  if(view==='connections'){
   const c=await api('/api/connections');if(token!==generation||key!==contextKey())return;state.connections=c;
   const checked=c.integrations.filter(x=>x.status==='healthy').length;
   const grid=node('div',{class:'connection-grid'});
   const freshRepo=c.repo&&Date.now()-Date.parse(c.repo.observedAt)<300000;
   grid.append(card('Local Git repository',c.repo?(freshRepo?'healthy':'stale'):c.repoConfigured?'unverified':'missing','Selected repository → code, file list and Git context. No automatic commits.',detail('Access','Read'+(state.snapshot.capabilities.fileWrite?' · file writes enabled':'')),detail('Last checked',datetime(c.repo?.observedAt)),detail('Branch',c.repo?.branch),button('Read repository now',async()=>{try{const r=await api('/api/local/read',{});if(key!==contextKey())return;state.snapshot.repo=r.repo;render();await show('connections');}catch(e){error(e);}},{disabled:!c.repoConfigured||!!state.replay})));
   for(const connection of c.integrations){const o=connection.observation;grid.append(card(connection.label,connection.status,connection.purpose,detail('Adapter',connection.type),detail('Connection',connection.source+' → Workspace'),detail('Permissions','Read only · '+state.context.scope+'/'+state.context.id),detail('Checked',datetime(o?.checkedAt)),detail('Valid until',datetime(o?.validUntil)),detail('Entries',o?.itemCount),node('p',{class:'muted'},o?.message||'No read attempted yet. This status does not confirm a working connection.'),node('div',{class:'dialog-actions'},button('Check connection',async()=>{try{await api('/api/connections/check',{connectionId:connection.id});if(key===contextKey())await show('connections');}catch(e){error(e);}},{disabled:!!state.replay}),button('Open memory',()=>switchView('memory')))));}
   grid.append(card('Agent bridge',c.runtimeBridge.state,'Claude Code / Codex / other runtimes → explicitly exported metadata. No terminal access.',detail('Imported sessions',c.runtimeBridge.sessionCount),detail('Contract','Session · task · usage'),node('code',{},'node bin/bridge.mjs --file /private/events.jsonl')));
   grid.append(card('AI layout advisor',c.planner.state,c.planner.reason,detail('Mode','Optional · Codex CLI'),detail('Effect','Proposal → review → apply')));
   grid.append(card('Other services','missing','Calendar, Drive, MCP, vector stores and external actions each need a dedicated adapter.',detail('Next step','docs/INTEGRATIONS.md'),detail('Available now','Local JSON memory as an exchange format')));
   target.replaceChildren(node('div',{class:'integration-intro'},node('span',{class:'eyebrow'},'CONNECTION CENTER'),node('h2',{},'Know what is actually connected.'),node('p',{class:'muted'},'Checks apply to local sources, independently of demo metrics. Green = check passed; red = read check failed; amber = unchecked or stale. Imported events do not prove that an agent is running.')),
    node('div',{class:'connection-summary'},node('strong',{},checked+' / '+c.integrations.length+' memory sources checked'),node('span',{},'Project: '+state.context.id),node('span',{},'Context: '+state.context.scope)),grid,
    node('div',{class:'integration-note'},node('strong',{},'Connect a new source'),node('p',{},'Copy connections.example.json, link your own memory file and start with --connections-config. Paths and credentials stay on the host. Details: docs/MEMORY.md.')));
  }else{
   const data=await api('/api/memory');if(token!==generation||key!==contextKey())return;
   const search=field('Search project knowledge','search','',{placeholder:'Decision, source, workflow …',maxlength:160}),results=node('div',{class:'memory-results'}),count=node('p',{class:'muted'});
   let searchVersion=0;
   const draw=result=>{count.textContent=result.total+' matches · '+result.items.length+' shown · local text search';results.replaceChildren(...result.items.map(item=>node('article',{class:'memory-card'},node('div',{class:'section-header'},node('span',{class:'eyebrow'},item.quality==='demo'?'SYNTHETIC EXAMPLE':'SOURCE CONTENT · NOT VERIFIED'),pill(item.connectionStatus)),node('h3',{},item.title),node('p',{class:'memory-copy'},item.content),node('div',{class:'memory-tags'},...item.tags.map(t=>node('span',{},t))),detail('Source',item.source),detail('Connection',item.connectionId),detail('Content last updated',datetime(item.updatedAt)),node('details',{},node('summary',{},'Provenance & integrity'),detail('File SHA-256',item.sourceHash),detail('Content SHA-256',item.contentHash),node('p',{class:'muted'},'The hash identifies the content that was read; it does not verify its factual accuracy.')),button('Export context package',()=>download('oaos-memory-'+item.id+'.json',JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),project:structuredClone(state.context),modelContextInjected:false,untrustedSourceContent:true,item},null,2))))));if(!result.items.length)results.append(node('div',{class:'empty-state'},'No matching entry yet. First check a memory source under Connections.'));};
   const doSearch=async()=>{const version=++searchVersion;try{const r=await api('/api/memory',null,{q:search.el.value});if(token===generation&&version===searchVersion&&key===contextKey())draw(r);}catch(e){error(e);}};
   search.el.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});
   target.replaceChildren(node('div',{class:'integration-intro'},node('span',{class:'eyebrow'},'MEMORY LIBRARY'),node('h2',{},'Context you can take with you.'),node('p',{class:'muted'},'Read-only access to your own JSON memory. Sources, timestamps and hashes stay visible. Exported content is not automatically sent to a model.')),
    node('div',{class:'memory-search'},search.wrap,button('Search',doSearch,{class:'primary'}),button('Manage sources',()=>switchView('connections'))),count,results,
    node('p',{class:'integration-note'},'Memory content is data, not instructions. No automatic training, semantic search or writes to the source. An export includes the displayed content; review it before sharing.'));
   draw(data);
  }
 }
 return {show,clear};
}
