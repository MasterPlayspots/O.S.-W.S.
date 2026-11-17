import {node,button,option,number,datetime} from './ui.js';
export function usageSummary(records){
 const totals=records.map(r=>r.providerTotal!==null?r.providerTotal:r.totalSemantics==='disjoint_io'&&r.input!==null&&r.output!==null?r.input+r.output:null);
 const known=totals.filter(n=>n!==null),currencies={};for(const r of records)if(r.cost){const k=r.cost.currency+':'+r.cost.quality;currencies[k]=(currencies[k]||0)+r.cost.value;}
 return {total:records.length&&known.length===records.length?known.reduce((a,b)=>a+b,0):null,known:known.reduce((a,b)=>a+b,0),requests:records.length,coverage:known.length,currencies};
}
export const costs=u=>Object.entries(u.currencies).map(([k,v])=>`${v.toLocaleString('en-GB',{maximumFractionDigits:3})} ${k.split(':')[0]} (${({demo:'Demo',estimated:'estimated',reported:'reported'})[k.split(':')[1]]})`).join(' + ')||'Not reported';
export function createPaneFactory(actions){
 const buffers=new Map();
 const key=(m,id)=>`${m.context.scope}/${m.context.id}/${m.sourceMode}/${id}`;
 function editor(initial,body,foot,notes=false){
  let w=initial,m=null,readOnly=false,buffer=null,binding='',generation=0;
  const files=node('select',{'aria-label':'Select file'}),state=node('span',{class:'muted'}),save=button('Save draft',()=>buffer&&actions.saveDraft(w.fileId,buffer.content).then(()=>{buffer.dirty=false;buffer.persisted=true;renderState();}).catch(actions.error)),apply=button('Apply to file',()=>buffer&&actions.applyFile(w.fileId,buffer.content,buffer.hash));
  const toolbar=node('div',{class:'editor-toolbar'},files,state,save,apply),lines=node('pre',{class:'line-numbers','aria-hidden':'true'}),input=node('textarea',{class:notes?'notes-input':'code-input',spellcheck:'false','aria-label':notes?'Notes':'Edit code',wrap:'off'});
  body.append(toolbar,node('div',{class:'editor-wrap'},lines,input));
  function renderState(){state.textContent=buffer?(buffer.dirty?'Unsaved draft':buffer.persisted?'Draft saved':buffer.source==='selected-local-repository'?'Repository · read only':buffer.source==='note'?'Note draft':'Sample file'):'Select file';save.disabled=readOnly||!buffer;apply.hidden=!m?.capabilities.fileWrite||notes||m?.sourceMode==='demo';apply.disabled=readOnly||!buffer?.hash;input.readOnly=readOnly||!buffer;lines.textContent=Array.from({length:(input.value.match(/\n/g)||[]).length+1},(_,i)=>i+1).join('\n');foot.textContent=readOnly?'Historical view · editing disabled':notes?'Personal draft · stored on the server in the selected context':'Draft is preserved when moved · applying changes requires write permission';}
  input.addEventListener('input',()=>{if(!buffer||readOnly)return;buffer.content=input.value;buffer.dirty=true;renderState();actions.dirty();});
  input.addEventListener('scroll',()=>{lines.scrollTop=input.scrollTop;});
  input.addEventListener('keydown',e=>{if(e.key==='Tab'&&!input.readOnly){e.preventDefault();const start=input.selectionStart;input.setRangeText('  ',start,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));}if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();save.click();}});
  files.addEventListener('change',()=>actions.bindFile(w.id,files.value));
  async function load(){
   const id=w.fileId,k=key(m,id)+(readOnly?'/replay/'+m.replayId:'');if(binding===k){if(buffer&&document.activeElement!==input&&input.value!==buffer.content)input.value=buffer.content;return;}binding=k;const current=++generation;buffer=null;input.value='';renderState();
   if(!id){input.placeholder='Select an explicitly authorized file.';return;}
   if(!readOnly&&m.sourceMode!=='demo'&&id.startsWith('demo:')){input.placeholder='Demo file: select an authorized source file in connected mode.';return;}
   const local=buffers.get(k),saved=m.drafts[id];if(local){buffer=local;input.value=buffer.content;renderState();return;}
   if(saved!==undefined){buffer={content:typeof saved==='string'?saved:saved.content,dirty:false,persisted:true,hash:null,source:'draft'};}
   else if(readOnly){input.placeholder='This file version was not saved in the snapshot.';return;}
   else if(notes){buffer={content:'',dirty:false,persisted:false,hash:null,source:'note'};}
   else if(m.sourceMode!=='demo'&&id.startsWith('demo:')){input.placeholder='Connect a repository and select a file. Demo code is not shown in connected mode.';return;}
   else{try{const file=await actions.readFile(id);if(current!==generation)return;buffer={content:file.content,dirty:false,persisted:false,hash:file.hash??null,source:file.source||m.sourceMode};}catch(e){if(current===generation){input.placeholder=e.message;renderState();}return;}}
   buffers.set(k,buffer);input.value=buffer.content;renderState();
  }
  return {update(window,model,readonly){w=window;m=model;readOnly=readonly;input.setAttribute('aria-label',(notes?'Notes: ':'Code: ')+w.title);files.hidden=notes||readonly;
   const list=m.sourceMode==='demo'?Object.entries(m.data.files||{}).map(([id,f])=>({id,name:f.name})):m.repo?.files||[];
   const sig=JSON.stringify(list)+w.fileId;if(files.dataset.sig!==sig){files.dataset.sig=sig;files.replaceChildren(option('', 'Select file'),...list.map(f=>option(f.id||f.path,f.name||f.path||f.id,(f.id||f.path)===w.fileId)));files.value=w.fileId||'';}
   void load();renderState();},dispose(){generation++;}};
 }
 return {buffers,
  make(w,body,foot){
   if(w.kind==='code'||w.kind==='notes')return editor(w,body,foot,w.kind==='notes');
   let sig='';return {update(window,m,readonly){w=window;const signature=JSON.stringify([w,m.sourceMode,m.data,m.repo,m.usagePeriod,readonly]);if(sig===signature)return;sig=signature;body.replaceChildren();
    if(w.kind==='session'){
     const s=m.data.sessions.find(s=>s.id===w.sessionId),t=m.data.tasks.find(t=>t.id===w.taskId),u=usageSummary(m.data.usages.filter(r=>r.sessionId===w.sessionId));
     if(!s){body.append(node('div',{class:'empty-state'},node('strong',{},'No session connected yet'),node('p',{},'Import metadata from the selected agent run through the local bridge.'),button('Check connection',actions.sources)));foot.textContent='No active process reported';return;}
     body.append(node('div',{class:'session-heading'},node('span',{class:'runtime-mark'},s.runtime.slice(0,1)),node('div',{},node('strong',{},s.runtime),node('small',{},s.effectiveModelId||'Effective model not reported')),node('span',{class:'badge'},s.quality==='demo'?'DEMO':s.state)));
     body.append(node('div',{class:'session-message'},node('strong',{},s.quality==='demo'?'Sample agent report':'Reported next step'),node('p',{},s.nextStep||'Not reported'),node('small',{},s.quality==='demo'?'Illustration — no agent is running.':'Metadata only; no live transcript authorized.')));
     if(t)body.append(node('div',{class:'session-progress'},node('span',{},`${t.acceptedCount}/${t.eligibleCount} checkpoints · ${t.status}`),node('div',{class:'bar'},node('span',{style:`width:${t.eligibleCount?100*t.acceptedCount/t.eligibleCount:0}%`}))));
     body.append(node('div',{class:'session-stats'},node('span',{},'Tokens '+number(u.total)),node('span',{},costs(u))));
     body.append(node('div',{class:'session-composer'},node('input',{placeholder:'Controls require an authorized runtime adapter',disabled:true,'aria-label':'Session controls not connected'}),button('↗',()=>{},{disabled:true,'aria-label':'Not connected'})));
     foot.textContent=(s.quality==='demo'?'Sample data · ':'Last update · ')+datetime(s.heartbeatAt);
    }else if(w.kind==='tasks'){
     const tasks=m.data.tasks.filter(t=>t.status!=='accepted');body.append(node('div',{class:'list-stack'},...(tasks.length?tasks.map(t=>button(node('span',{},node('strong',{},t.title),node('small',{},t.status+' · '+t.acceptedCount+'/'+t.eligibleCount)),()=>actions.focusTask(t.id),{class:'task-row'})):[node('p',{class:'empty-state'},'No task source connected.')] )));foot.textContent='Click to open the related workspace · source data stays unchanged';
    }else if(w.kind==='usage'){
     const u=usageSummary(m.data.usages);body.append(node('div',{class:'usage-pane'},node('strong',{class:'big-number'},number(u.total)),node('p',{},'Tokens · '+u.coverage+'/'+u.requests+' requests with complete totals'),node('p',{},costs(u)),...m.data.sessions.map(s=>node('div',{class:'detail-line'},node('span',{},s.runtime),node('strong',{},number(usageSummary(m.data.usages.filter(r=>r.sessionId===s.id)).total))))));foot.textContent='Input / output / cache remain separate; costs grouped by currency and source';
    }else if(w.kind==='files'){
     const files=m.sourceMode==='demo'?Object.entries(m.data.files).map(([id,f])=>({id,name:f.name})):m.repo?.files||[];body.append(node('div',{class:'list-stack'},...(files.length?files.slice(0,80).map(f=>button(f.name||f.path||f.id,()=>actions.openFile(f.id||f.path),{class:'file-row'})):[node('p',{class:'empty-state'},'Select and read a repository under Connections first.')])));foot.textContent='Authorized text files only';
    }
   }};
  }
 };
}
