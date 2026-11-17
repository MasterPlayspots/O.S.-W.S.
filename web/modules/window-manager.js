import {node,button} from './ui.js';
import {clone,validateLayout} from './contracts.js';
export function createWindowManager({container,onSelect,onAction,onGeometry,makePane}){
 const entries=new Map();let drag=null;
 function create(w){
  const title=node('span',{class:'window-title'}),context=node('div',{class:'window-context'}),meta=node('div',{class:'window-meta'}),body=node('div',{class:'window-body'}),foot=node('div',{class:'window-foot'});
  const controls=node('div',{class:'window-tools'});
  const buttons={};for(const[action,label,tooltip]of [['pin','◇','Pin window'],['split','⊞','Duplicate window'],['minimize','−','Minimize'],['maximize','⤢','Maximize / restore'],['close','×','Close window']])buttons[action]=button(label,e=>{e.stopPropagation();onAction(w.id,action);},{'aria-label':tooltip,title:tooltip});
  controls.append(...Object.values(buttons));
  const header=node('div',{class:'window-header'},node('span',{class:'window-dot'}),title,controls);
  const resize=button('◢',()=>{}, {class:'resize-handle','aria-label':'Resize window',title:'Drag to resize or edit dimensions in the context panel'});
  const el=node('article',{class:'window','data-window-id':w.id,tabindex:'0','aria-label':w.title},header,context,meta,body,foot,resize);
  const entry={el,title,context,meta,body,foot,header,resize,buttons,window:w,pane:makePane(w,body,foot)};
  el.addEventListener('pointerdown',()=>onSelect(w.id));
  el.addEventListener('focusin',()=>onSelect(w.id));
  header.addEventListener('dblclick',e=>{if(!e.target.closest('button'))onAction(w.id,'maximize');});
  header.addEventListener('pointerdown',e=>start(e,entry,false));resize.addEventListener('pointerdown',e=>start(e,entry,true));
  el.addEventListener('keydown',e=>{if(e.target===el&&e.altKey&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();if(entry.window.pinned)return;const rect={...entry.window.rect};rect.x+=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;rect.y+=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;onGeometry(w.id,rect);}});
  container.append(el);return entry;
 }
 function start(e,entry,resizing){
  if(e.button!==0||(!resizing&&e.target.closest('button'))||entry.window.pinned||entry.readonly||innerWidth<1700||entry.el.classList.contains('maximized'))return;
  e.preventDefault();const r=container.getBoundingClientRect(),style=getComputedStyle(container),gap=parseFloat(style.columnGap)||12,row=parseFloat(style.gridAutoRows)||73;
  drag={entry,resizing,startX:e.clientX,startY:e.clientY,rect:{...entry.window.rect},col:(r.width+gap)/12,row:row+gap};
  e.currentTarget.setPointerCapture(e.pointerId);entry.el.classList.add('dragging');
  const move=ev=>{if(!drag)return;const dx=ev.clientX-drag.startX,dy=ev.clientY-drag.startY;if(!resizing)entry.el.style.transform=`translate(${dx}px,${dy}px)`;else entry.el.style.outline='2px dashed var(--oa-accent)';};
  const finish=ev=>{const d=drag;drag=null;e.currentTarget.removeEventListener('pointermove',move);e.currentTarget.removeEventListener('pointerup',finish);e.currentTarget.removeEventListener('pointercancel',cancel);entry.el.style.transform='';entry.el.style.outline='';entry.el.classList.remove('dragging');if(!d)return;const dx=Math.round((ev.clientX-d.startX)/d.col),dy=Math.round((ev.clientY-d.startY)/d.row),rect={...d.rect};if(resizing){rect.w+=dx;rect.h+=dy;}else{rect.x+=dx;rect.y+=dy;}onGeometry(entry.window.id,rect);};
  const cancel=()=>{drag=null;entry.el.style.transform='';entry.el.style.outline='';entry.el.classList.remove('dragging');e.currentTarget.removeEventListener('pointermove',move);e.currentTarget.removeEventListener('pointerup',finish);e.currentTarget.removeEventListener('pointercancel',cancel);};
  e.currentTarget.addEventListener('pointermove',move);e.currentTarget.addEventListener('pointerup',finish);e.currentTarget.addEventListener('pointercancel',cancel);
 }
 return {
  render({layout,pageId,view,selected,maximized,mobileId,readonly,model}){
   const all=layout.pages.flatMap(p=>p.windows);for(const w of all){let e=entries.get(w.id);if(!e){e=create(w);entries.set(w.id,e);}e.window=w;e.readonly=readonly;e.title.textContent=w.title;e.el.setAttribute('aria-label',w.title);e.el.classList.toggle('selected',w.id===selected);e.el.classList.toggle('maximized',w.id===maximized);e.el.classList.toggle('mobile-hidden',w.id!==mobileId);
    e.el.hidden=!layout.pages.find(p=>p.id===pageId)?.windows.some(x=>x.id===w.id)||w.closed||w.minimized||!['workspace','code','sessions'].includes(view)||(view==='code'&&w.kind!=='code')||(view==='sessions'&&w.kind!=='session');
    for(const[k,v]of Object.entries(w.rect))e.el.style.setProperty('--'+k,v);e.el.style.setProperty('--order',w.mobileOrder);e.el.style.setProperty('--level',w.level);
    e.buttons.pin.textContent=w.pinned?'◆':'◇';e.buttons.pin.setAttribute('aria-pressed',String(w.pinned));for(const k of ['pin','split','minimize','close'])e.buttons[k].disabled=readonly;e.resize.hidden=readonly||w.pinned;
    const s=model.data.sessions.find(s=>s.id===w.sessionId),t=model.data.tasks.find(t=>t.id===w.taskId);
    e.context.textContent=(t?.title||'Project context')+' · '+(s?.branch||model.repo?.branch||'Branch not reported');
    e.meta.textContent=s?`${s.runtime} · ${s.effectiveModelId||'Model not reported'} · ${s.quality==='demo'?'DEMO':s.state}`:(model.sourceMode==='demo'?'DEMONSTRATION':'Selected source');
    e.pane.update(w,model,readonly);
   }
   for(const[id,e]of entries)if(!all.some(w=>w.id===id)){e.pane.dispose?.();e.el.remove();entries.delete(id);}
  },focus(id){entries.get(id)?.el.focus({preventScroll:true});entries.get(id)?.el.scrollIntoView({behavior:'instant',block:'nearest'});},get active(){return !!drag;},dispose(){for(const e of entries.values())e.pane.dispose?.();entries.clear();container.replaceChildren();}
 };
}
