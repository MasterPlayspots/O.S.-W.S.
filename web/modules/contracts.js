export const KINDS=['code','session','tasks','notes','usage','files'];
export const clone=v=>structuredClone(v);
export function fields(v,keys,label='Objekt'){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!keys.includes(k)))throw Error('Ungültige Felder: '+label);}
export function ident(v){if(typeof v!=='string'||['__proto__','prototype','constructor'].includes(v)||!/^[a-zA-Z0-9._-]{1,80}$/.test(v))throw Error('Ungültige ID.');return v;}
export function text(v,max=100){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error('Ungültiger Text.');return v;}
export function context(p){fields(p,['id','scope'],'Projekt');ident(p.id);if(!['private','business'].includes(p.scope))throw Error('Ungültiger Kontext.');return p;}
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function validateLayout(input){
 fields(input,['schemaVersion','theme','pages'],'Layout');
 if(input.schemaVersion!==1||!['uniforce','black-glass','oaos'].includes(input.theme))throw Error('Layoutversion/Theme ungültig.');
 if(!Array.isArray(input.pages)||!input.pages.length||input.pages.length>12)throw Error('1–12 Seiten erforderlich.');
 const ids=new Set();
 for(const p of input.pages){
  fields(p,['id','title','windows'],'Seite');ident(p.id);text(p.title,50);if(ids.has(p.id))throw Error('Doppelte ID.');ids.add(p.id);
  if(!Array.isArray(p.windows)||p.windows.length>24)throw Error('Maximal 24 Fenster je Seite.');
  for(const w of p.windows){
   fields(w,['id','kind','title','taskId','sessionId','fileId','pinned','minimized','closed','rect','mobileOrder','level'],'Fenster');
   ident(w.id);text(w.title,80);if(ids.has(w.id)||!KINDS.includes(w.kind))throw Error('Fenster-ID oder Typ ungültig.');ids.add(w.id);
   for(const k of ['taskId','sessionId','fileId'])if(w[k]!==null)text(w[k],160);
   for(const k of ['pinned','minimized','closed'])if(typeof w[k]!=='boolean')throw Error('Ungültiger Fensterstatus.');
   fields(w.rect,['x','y','w','h'],'Raster');
   const b=w.rect;if(Object.keys(b).length!==4||!Object.values(b).every(Number.isSafeInteger)||b.x<0||b.y<0||b.w<2||b.w>12||b.h<2||b.h>12||b.x+b.w>12||b.y+b.h>64)throw Error('Fenster außerhalb des Rasters.');
   if(!Number.isSafeInteger(w.mobileOrder)||w.mobileOrder<0||w.mobileOrder>99||!Number.isSafeInteger(w.level)||w.level<0||w.level>5)throw Error('Ebene oder Reihenfolge ungültig.');
  }
  const visible=p.windows.filter(w=>!w.minimized&&!w.closed);
  for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++)if(overlaps(visible[i].rect,visible[j].rect))throw Error('Fenster überlappen. Freien Rasterplatz wählen.');
 }
 return clone(input);
}
export function freeRect(windows,w=4,h=4){
 for(let y=0;y<=64-h;y++)for(let x=0;x<=12-w;x++){const rect={x,y,w,h};if(!windows.some(n=>!n.closed&&!n.minimized&&overlaps(rect,n.rect)))return rect;}
 throw Error('Kein freier Rasterplatz.');
}
export function proposeLayout(layout,pageId,{focusId=null,style='balanced',busy=false}={}){
 const next=clone(layout),page=next.pages.find(p=>p.id===pageId);if(!page)throw Error('Seite fehlt.');
 if(busy)throw Error('Aktive Eingabe zuerst beenden.');
 const fixed=page.windows.filter(w=>w.pinned||w.id===focusId);
 const movable=page.windows.filter(w=>!w.pinned&&w.id!==focusId&&!w.closed&&!w.minimized);
 const occupied=fixed.slice();
 movable.forEach((w,i)=>{w.rect=freeRect(occupied,style==='focus'&&i===0?8:4,style==='focus'&&i===0?6:4);occupied.push(w);});
 return validateLayout(next);
}
export function progress(tasks){const eligible=tasks.filter(t=>t.status!=='cancelled'),accepted=eligible.filter(t=>t.status==='accepted').length;return {accepted,total:eligible.length,percent:eligible.length?Math.round(100*accepted/eligible.length):null};}
