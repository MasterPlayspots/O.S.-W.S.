export const $=s=>document.querySelector(s);
export function node(tag,attrs={},...children){const el=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k==='class')el.className=v;else if(k==='text')el.textContent=v;else if(k.startsWith('on'))el.addEventListener(k.slice(2),v);else if(k==='checked'||k==='disabled'||k==='hidden')el[k]=v;else el.setAttribute(k,v);}for(const child of children.flat()){if(child!==null&&child!==undefined)el.append(child instanceof Node?child:document.createTextNode(String(child)));}return el;}
export function button(label,fn,attrs={}){return node('button',{type:'button',onclick:fn,...attrs},label);}
export function option(value,label,selected=false){return node('option',{value,...(selected?{selected:''}:{})},label);}
export const number=v=>v===null||v===undefined?'Not reported':new Intl.NumberFormat('en-GB',{notation:v>=10000?'compact':'standard',maximumFractionDigits:1}).format(v);
export const datetime=v=>v?new Date(v).toLocaleString('en-GB',{timeZone:'Europe/Berlin',dateStyle:'short',timeStyle:'short'}):'Not reported';
let timer;export function toast(message,error=false){clearTimeout(timer);$('#toast').textContent=message;$('#toast').className='visible'+(error?' error':'');timer=setTimeout(()=>$('#toast').className='',7000);}
export function modal(title,content){$('#modal-title').textContent=title;$('#modal-content').replaceChildren(content);if(!$('#modal').open)$('#modal').showModal();}
export const closeModal=()=>$('#modal').close();
export function field(label,type,value,attrs={}){const input=node(type==='select'?'select':type==='textarea'?'textarea':'input',{...(type==='select'||type==='textarea'?{}:{type}),...attrs});if(type==='select')input.append(...value);else input.value=value??'';return {el:input,wrap:node('label',{},label,input)};}
export function metric(label,value,detail,percent=null){const out=node('div',{class:'kpi'},node('label',{},label),node('strong',{},value),node('small',{},detail));if(percent!==null)out.append(node('div',{class:'bar'},node('span',{style:'width:'+Math.max(0,Math.min(100,percent))+'%'})));return out;}
export function detail(label,value){return node('div',{class:'detail-line'},node('span',{},label),node('strong',{},value??'Not reported'));}
