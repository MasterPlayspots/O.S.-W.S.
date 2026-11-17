import {$,node,button,field,detail,datetime} from './ui.js';
const labels={healthy:'Geprüft',error:'Fehler',stale:'Erneut prüfen',unverified:'Ungeprüft',waiting:'Wartet auf Import',disabled:'Deaktiviert',imported:'Import vorhanden',detected:'Erkannt · ungeprüft',ready:'Lauf bestätigt',blocked:'Blockiert',unavailable:'Nicht verfügbar',missing:'Nicht verbunden'};
export function createIntegrationViews({api,state,error,render,download,switchView}){
 let generation=0;
 const contextKey=()=>state.context.scope+'/'+state.context.id;
 const pill=status=>node('span',{class:'connection-status '+status},node('i',{'aria-hidden':'true'}),labels[status]||status);
 const card=(title,status,description,...children)=>node('article',{class:'connection-card'},node('div',{class:'section-header'},node('h3',{},title),pill(status)),node('p',{class:'muted'},description),...children);
 function clear(){generation++;$('#connections-panel').replaceChildren();$('#memory-panel').replaceChildren();}
 async function show(view){
  const token=++generation,key=contextKey(),target=$(view==='memory'?'#memory-panel':'#connections-panel');
  target.replaceChildren(node('p',{class:'muted'},'Quellen im gewählten Kontext laden …'));
  if(view==='connections'){
   const c=await api('/api/connections');if(token!==generation||key!==contextKey())return;state.connections=c;
   const checked=c.integrations.filter(x=>x.status==='healthy').length;
   const grid=node('div',{class:'connection-grid'});
   const freshRepo=c.repo&&Date.now()-Date.parse(c.repo.observedAt)<300000;
   grid.append(card('Lokales Git-Repository',c.repo?(freshRepo?'healthy':'stale'):c.repoConfigured?'unverified':'missing','Ausgewähltes Repository → Code, Dateiliste und Git-Kontext. Kein automatischer Commit.',detail('Zugriff','Lesen'+(state.snapshot.capabilities.fileWrite?' · Dateiübernahme freigegeben':'')),detail('Letzte Prüfung',datetime(c.repo?.observedAt)),detail('Branch',c.repo?.branch),button('Repo jetzt lesen',async()=>{try{const r=await api('/api/local/read',{});if(key!==contextKey())return;state.snapshot.repo=r.repo;render();await show('connections');}catch(e){error(e);}},{disabled:!c.repoConfigured||!!state.replay})));
   for(const connection of c.integrations){const o=connection.observation;grid.append(card(connection.label,connection.status,connection.purpose,detail('Adapter',connection.type),detail('Verbindung',connection.source+' → Workspace'),detail('Rechte','Nur lesen · '+state.context.scope+'/'+state.context.id),detail('Geprüft',datetime(o?.checkedAt)),detail('Gültig bis',datetime(o?.validUntil)),detail('Einträge',o?.itemCount),node('p',{class:'muted'},o?.message||'Noch kein Leseversuch. Status ist keine Verbindungszusage.'),node('div',{class:'dialog-actions'},button('Verbindung prüfen',async()=>{try{await api('/api/connections/check',{connectionId:connection.id});if(key===contextKey())await show('connections');}catch(e){error(e);}},{disabled:!!state.replay}),button('Memory öffnen',()=>switchView('memory')))));}
   grid.append(card('Agenten-Bridge',c.runtimeBridge.state,'Claude Code / Codex / andere Runtimes → explizit exportierte Metadaten. Kein Terminalzugriff.',detail('Sessions importiert',c.runtimeBridge.sessionCount),detail('Vertrag','Session · Aufgabe · Usage'),node('code',{},'node bin/bridge.mjs --file /private/events.jsonl')));
   grid.append(card('KI-Layoutberater',c.planner.state,c.planner.reason,detail('Modus','Optional · Codex CLI'),detail('Wirkung','Vorschlag → Prüfung → Übernahme')));
   grid.append(card('Weitere Dienste','missing','Kalender, Drive, MCP, Vector Stores und externe Aktionen benötigen jeweils einen eigenen Adapter.',detail('Nächster Schritt','docs/INTEGRATIONS.md'),detail('Bereits nutzbar','Lokale JSON-Memory als Übergabeformat')));
   target.replaceChildren(node('div',{class:'integration-intro'},node('span',{class:'eyebrow'},'CONNECTION CENTER'),node('h2',{},'Wissen, was wirklich verbunden ist.'),node('p',{class:'muted'},'Prüfungen beziehen sich auf lokale Quellen, unabhängig von Demo-KPIs. Grün = erfolgreich geprüft; Rot = Leseprüfung fehlgeschlagen; Gelb = ungeprüft oder veraltet. Importmeldungen belegen keinen laufenden Agenten.')),
    node('div',{class:'connection-summary'},node('strong',{},checked+' / '+c.integrations.length+' Memory-Quellen geprüft'),node('span',{},'Projekt: '+state.context.id),node('span',{},'Kontext: '+state.context.scope)),grid,
    node('div',{class:'integration-note'},node('strong',{},'Eine neue Quelle anschließen'),node('p',{},'connections.example.json kopieren, eigene Memory-Datei binden und mit --connections-config starten. Pfade und Zugangsdaten bleiben am Host. Details: docs/MEMORY.md.')));
  }else{
   const data=await api('/api/memory');if(token!==generation||key!==contextKey())return;
   const search=field('Projektwissen durchsuchen','search','',{placeholder:'Entscheidung, Quelle, Arbeitsablauf …',maxlength:160}),results=node('div',{class:'memory-results'}),count=node('p',{class:'muted'});
   let searchVersion=0;
   const draw=result=>{count.textContent=result.total+' Treffer · '+result.items.length+' angezeigt · lokale Textsuche';results.replaceChildren(...result.items.map(item=>node('article',{class:'memory-card'},node('div',{class:'section-header'},node('span',{class:'eyebrow'},item.quality==='demo'?'SYNTHETISCHES BEISPIEL':'QUELLINHALT · NICHT VERIFIZIERT'),pill(item.connectionStatus)),node('h3',{},item.title),node('p',{class:'memory-copy'},item.content),node('div',{class:'memory-tags'},...item.tags.map(t=>node('span',{},t))),detail('Quelle',item.source),detail('Verbindung',item.connectionId),detail('Inhalt zuletzt aktualisiert',datetime(item.updatedAt)),node('details',{},node('summary',{},'Herkunft & Integrität'),detail('Datei SHA-256',item.sourceHash),detail('Inhalt SHA-256',item.contentHash),node('p',{class:'muted'},'Hash bestätigt den gelesenen Inhalt, nicht seine sachliche Richtigkeit.')),button('Kontextpaket exportieren',()=>download('oaos-memory-'+item.id+'.json',JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),project:structuredClone(state.context),modelContextInjected:false,untrustedSourceContent:true,item},null,2))))));if(!result.items.length)results.append(node('div',{class:'empty-state'},'Noch kein passender Eintrag. Zuerst eine Memory-Quelle unter Verbindungen prüfen.'));};
   const doSearch=async()=>{const version=++searchVersion;try{const r=await api('/api/memory',null,{q:search.el.value});if(token===generation&&version===searchVersion&&key===contextKey())draw(r);}catch(e){error(e);}};
   search.el.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});
   target.replaceChildren(node('div',{class:'integration-intro'},node('span',{class:'eyebrow'},'MEMORY LIBRARY'),node('h2',{},'Kontext, den du mitnehmen kannst.'),node('p',{class:'muted'},'Lesende Anbindung an deine eigene JSON-Memory. Quellen, Zeitstempel und Hashes bleiben sichtbar. Exportierte Inhalte werden nicht automatisch an ein Modell übertragen.')),
    node('div',{class:'memory-search'},search.wrap,button('Suchen',doSearch,{class:'primary'}),button('Quellen verwalten',()=>switchView('connections'))),count,results,
    node('p',{class:'integration-note'},'Memory-Inhalte sind Daten, keine Befehle. Kein automatisches Training, keine semantische Suche und kein Schreiben in die Quelle. Ein Export enthält die angezeigten Inhalte; vor Weitergabe prüfen.'));
   draw(data);
  }
 }
 return {show,clear};
}
