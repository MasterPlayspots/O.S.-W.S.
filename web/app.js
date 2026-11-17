let retainedTheme="black-glass";
'use strict';
const $=id=>document.getElementById(id), session=document.querySelector('meta[name="oa-session"]').content;
const catalog=[['project.metadata.read','Project overview'],['tasks.read','Tasks'],['calendar.read','Calendar'],['messages.read','Communication'],['files.read','Files'],['metrics.read','Metrics'],['model.execute','AI workspace']];
let project={id:'my-workspace',scope:'business'},revision=0,step=0,view='desktop',currentResult=null,sequence=0,timer,dirty=false,busy=false;
const goalRows=new Map();
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').dataset.error=String(error);}
async function api(path,body){
  const response=await fetch(path,{method:body===undefined?'GET':'POST',headers:{'x-oa-session':session,...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const data=await response.json();if(!response.ok){const messages={'Pinned elements exceed the visible limit':'There are more pinned items than visible slots. Increase the focus limit or unpin an item.','Provide 1–20 goals':'Select at least one work area.','Invalid pinned capabilities':'A pinned area must also be selected.','Invalid goal priority':'Priorities must be between 0 and 100.'};const error=new Error(messages[data.error]||data.error||'Request failed.');error.status=response.status;throw error;}return data;
}
function defaults(){return {preferences:{project:{...project},goals:[{capability:'project.metadata.read',priority:90},{capability:'tasks.read',priority:100},{capability:'calendar.read',priority:80}],pinnedCapabilities:['tasks.read'],focus:{visibleLimit:3,notifications:'quiet',reducedMotion:true},appearance:{theme:'black-glass',glass:65,depth:35}},repository:'MasterPlayspots/O.S.-W.S.'};}
for(const [capability,title] of catalog){
  const row=node('div',undefined,'goal'),label=node('label',undefined,'check'),check=node('input');check.type='checkbox';check.id='goal-'+capability;
  label.append(check,document.createTextNode(title));const pin=node('button','Pin','pin');pin.type='button';pin.setAttribute('aria-label',title+' — pin');pin.setAttribute('aria-pressed','false');
  const rangeLabel=node('label',undefined,'priority');rangeLabel.append(document.createTextNode('PRIORITY'));const range=node('input');range.type='range';range.min='0';range.max='100';range.value='50';range.setAttribute('aria-label','Priority: '+title);const output=node('output','50');rangeLabel.append(range,output);row.append(label,pin,rangeLabel);$('goals').append(row);
  goalRows.set(capability,{check,pin,range,output,rangeLabel});
  pin.addEventListener('click',()=>{pin.setAttribute('aria-pressed',String(pin.getAttribute('aria-pressed')!=='true'));changed();});
  check.addEventListener('input',()=>{if(!check.checked)pin.setAttribute('aria-pressed','false');syncGoals();});
}
function syncGoals(){for(const r of goalRows.values()){r.rangeLabel.hidden=!r.check.checked;r.pin.disabled=!r.check.checked;r.output.textContent=r.range.value;}}
function profile(){return {preferences:{project:{...project},goals:[...goalRows].filter(([,r])=>r.check.checked).map(([capability,r])=>({capability,priority:Number(r.range.value)})),pinnedCapabilities:[...goalRows].filter(([,r])=>r.check.checked&&r.pin.getAttribute('aria-pressed')==='true').map(([c])=>c),focus:{visibleLimit:Number($('limit').value),notifications:$('notifications').value,reducedMotion:$('motion').checked},appearance:{theme:retainedTheme,glass:Number($('glass').value),depth:Number($('depth').value)}},repository:$('repository').value.trim()||null};}
function fill(value){
  retainedTheme=value.preferences.appearance.theme;
  const p=value.preferences;
  for(const [cap,r] of goalRows){const goal=p.goals.find(g=>g.capability===cap);r.check.checked=!!goal;r.range.value=String(goal?.priority??50);r.pin.setAttribute('aria-pressed',String(p.pinnedCapabilities.includes(cap)));}
  $('limit').value=p.focus.visibleLimit;$('notifications').value=p.focus.notifications;$('motion').checked=p.focus.reducedMotion;$('glass').value=p.appearance.glass;$('depth').value=p.appearance.depth;$('repository').value=value.repository||'';
  syncGoals();applyStyle();
}
function applyStyle(){
  for(const id of ['glass','depth'])document.documentElement.style.setProperty('--'+id,$(id).value);
  for(const id of ['glass','depth','limit'])$(id+'-value').value=$(id).value;
  document.body.classList.toggle('reduce-motion',$('motion').checked);
}
function changed(){dirty=true;$('revision').textContent=`Draft · Revision ${revision}`;syncGoals();applyStyle();clearTimeout(timer);sequence++;timer=setTimeout(preview,160);}
async function preview(){
  const seq=++sequence;
  try{const result=await api('/api/preview',{profile:profile()});if(seq!==sequence)return;currentResult=result;render();feedback(dirty?'Preview updated · not saved yet.':'Profile loaded. You can now customize your workspace.');}
  catch(error){if(seq!==sequence)return;currentResult=null;$('board').replaceChildren();$('empty').hidden=false;$('plan-summary').textContent='Draft is not valid yet';$('source-status').textContent='Please correct the settings first. No new source has been read.';$('drawer-content').replaceChildren();$('gaps').replaceChildren();$('drawer-count').textContent='0';$('gap-count').textContent='0';feedback(error.message,true);}
}
function sourceText(){
  const s=currentResult?.source;
  if(!s)return 'No source has been read in this session. Read the source now to load actual data.';
  return `${currentResult.sourceFresh?'Read':'Stale'}: ${s.repository} · ${new Date(s.observedAt).toLocaleTimeString('en-GB')} · ${s.access==='anonymous_public_read'?'public metadata':'Source'}. Check again after 15 minutes.`;
}
function card(dot,index){
  const e=node('article',undefined,'dot'),head=node('div',undefined,'dot-head');head.append(node('span',String(index+1).padStart(2,'0')+' / DOT'),node('span',dot.pinned?'PINNED':'FLEXIBLE'));e.append(head,node('h3',dot.title));
  const source=dot.capability==='project.metadata.read'?currentResult.source:null;
  if(source){
    e.append(node('p',source.repository));const stats=node('div',undefined,'statline');for(const [value,label] of [[source.language||'—','LANGUAGE'],[source.openIssuesAndPRs,'OPEN ISSUES + PRs']]){const stat=node('div');stat.append(node('strong',String(value)),node('span',label));stats.append(stat);}e.append(stats);
    const a=node('a','Open repository ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';e.append(a,node('p',(currentResult.sourceFresh?'Read from public source':'Stale snapshot')+' · '+new Date(source.observedAt).toLocaleString('en-GB'),'missing'));
  }else e.append(node('p','This area is reserved for you. Its data will appear here once the source is connected.'),node('p','SOURCE NOT CONNECTED YET','missing'));
  const details=node('details');details.append(node('summary','Why is this here?'),node('p',dot.reason));e.append(details);
  e.addEventListener('pointermove',event=>{if($('motion').checked||event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=e.getBoundingClientRect(),factor=Number($('depth').value)/20;e.style.setProperty('--tx',`${-(event.clientY-b.top-b.height/2)/b.height*factor}deg`);e.style.setProperty('--ty',`${(event.clientX-b.left-b.width/2)/b.width*factor}deg`);});
  e.addEventListener('pointerleave',()=>{e.style.setProperty('--tx','0deg');e.style.setProperty('--ty','0deg');});return e;
}
function render(){
  if(!currentResult)return;
  const p=currentResult.plan,mobile=view==='mobile'||matchMedia('(max-width:740px)').matches;
  const ids=mobile?[p.views.mobile.primary,...p.views.mobile.secondary]:p.views.desktop.visible;
  $('board').classList.toggle('mobile',mobile);$('board').replaceChildren(...ids.map((id,i)=>card(p.dots.find(d=>d.id===id),i)));$('empty').hidden=true;
  $('board-title').textContent=project.scope==='private'?'My personal focus.':'My work focus.';
  $('plan-summary').textContent=`${ids.length} VISIBLE · ${p.dots.length} AREAS · ${mobile?'MOBILE':'DESKTOP'}`;
  const drawer=mobile?p.views.mobile.drawer:p.views.desktop.drawer;$('drawer-count').textContent=drawer.length;$('drawer-content').replaceChildren(...drawer.map(id=>{const dot=p.dots.find(d=>d.id===id),el=node('div',undefined,'drawer-item');el.append(node('strong',dot.title),node('p',dot.reason));return el;}));
  $('gap-count').textContent=p.connectorTasks.length;$('gaps').replaceChildren(...p.connectorTasks.map(task=>{const el=node('div',undefined,'drawer-item'),dot=p.dots.find(d=>d.capability===task.capability),steps=node('ol');steps.append(...task.steps.map(s=>node('li',s)));el.append(node('strong',dot.title),steps,node('p','Connection plan · not executed'));return el;}));$('source-status').textContent=sourceText();
}
function showStep(n){step=n;document.querySelectorAll('[data-panel]').forEach(el=>el.hidden=Number(el.dataset.panel)!==step);document.querySelectorAll('[data-step]').forEach(el=>{if(Number(el.dataset.step)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});$('back').disabled=step===0;$('next').disabled=step===2;$('step-label').textContent=`${step+1} / 3`;}
async function blocking(operation){
  if(busy)return;busy=true;clearTimeout(timer);sequence++;
  const controls=[...document.querySelectorAll('button,input,select')].map(el=>({el,disabled:el.disabled}));controls.forEach(({el})=>el.disabled=true);
  try{await operation();}catch(error){feedback(error.message+(error.status===409?' Your draft is preserved. Export it as JSON before reloading.':''),true);}
  finally{controls.forEach(({el,disabled})=>el.disabled=disabled);busy=false;syncGoals();showStep(step);}
}
async function load(){await blocking(async()=>{
  const next={id:$('project').value.trim(),scope:$('scope').value};const data=await api(`/api/profile?project=${encodeURIComponent(next.id)}&scope=${next.scope}`);
  project=next;revision=data.revision;dirty=false;$('active-context').textContent=`Active: ${project.id} · ${project.scope==='private'?'Personal':'Business'}`;fill(data.profile||defaults());$('revision').textContent=revision?`Saved · Revision ${revision}`:'New profile';
  try{localStorage.setItem('oa-active-project',JSON.stringify(project));}catch{}
  await preview();
});}
$('setup-form').addEventListener('submit',e=>e.preventDefault());$('setup-form').addEventListener('input',changed);
document.querySelectorAll('[data-step]').forEach(el=>el.addEventListener('click',()=>showStep(Number(el.dataset.step))));$('back').onclick=()=>showStep(step-1);$('next').onclick=()=>showStep(step+1);
$('desktop').onclick=()=>{view='desktop';$('desktop').setAttribute('aria-pressed','true');$('mobile').setAttribute('aria-pressed','false');render();};$('mobile').onclick=()=>{view='mobile';$('desktop').setAttribute('aria-pressed','false');$('mobile').setAttribute('aria-pressed','true');render();};
matchMedia('(max-width:740px)').addEventListener('change',render);
$('load').onclick=load;
$('save').onclick=()=>blocking(async()=>{const data=await api('/api/profile',{profile:profile(),baseRevision:revision});revision=data.revision;dirty=false;currentResult=data;render();$('revision').textContent=`Saved · Revision ${revision}`;feedback(`Saved locally. Revision ${revision} · ${new Date(data.updatedAt).toLocaleTimeString('en-GB')}.`);});
$('connect').onclick=()=>blocking(async()=>{currentResult=await api('/api/preview',{profile:profile()});render();feedback('Reading public GitHub metadata …');await api('/api/github',{project,repository:$('repository').value.trim()});dirty=true;$('revision').textContent=`Draft · Revision ${revision}`;await preview();});
$('disconnect').onclick=()=>{$('repository').value='';changed();};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(profile(),null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='oa-workspace-profile.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback('Draft exported as JSON. It contains your preferences and the selected public repository name.');};
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
// Re-evaluate freshness locally, without background requests to GitHub or layout edits.
setInterval(()=>{if(currentResult?.source&&currentResult.sourceFresh&&Date.parse(currentResult.source.expiresAt)<=Date.now()&&!busy)preview();},15000);
try{const saved=JSON.parse(localStorage.getItem('oa-active-project'));if(saved&&typeof saved.id==='string'&&['private','business'].includes(saved.scope)){$('project').value=saved.id;$('scope').value=saved.scope;}}catch{}
fill(defaults());showStep(0);load();
