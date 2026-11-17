import {readFile,lstat} from 'node:fs/promises';
import {context} from '../web/modules/contracts.js';
// Explicit local metadata import only. Never scans a home directory or reads CLI auth.
try {
 const args=process.argv.slice(2),options={url:'http://127.0.0.1:4317',project:'workspace-core',scope:'business'};
 for(let i=0;i<args.length;i++){
  if(args[i]==='--help'){console.log('node bin/bridge.mjs --file /private/events.jsonl [--url http://127.0.0.1:4317] [--project workspace-core] [--scope business|private]\nImports normalized metadata only; event IDs make retries idempotent.');process.exit(0);}
  const key=args[i].replace(/^--/,'');if(!['file','url','project','scope'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))throw Error('Ungültige Argumente; --help verwenden.');options[key]=args[++i];
 }
 if(!options.file)throw Error('Eine ausdrücklich ausgewählte JSONL-Datei ist erforderlich.');
 const info=await lstat(options.file);if(!info.isFile()||info.isSymbolicLink()||info.size>2097152)throw Error('Nur reguläre JSONL-Dateien bis 2 MiB.');
 const origin=new URL(options.url);if(origin.protocol!=='http:'||origin.hostname!=='127.0.0.1'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('Nur direkte lokale HTTP-Adresse ohne Credentials erlaubt.');
 const project=context({id:options.project,scope:options.scope}),lines=(await readFile(options.file,'utf8')).split('\n').filter(l=>l.trim());if(!lines.length||lines.length>1000)throw Error('1–1000 Ereignisse erforderlich.');
 const events=lines.map((l,i)=>{if(Buffer.byteLength(l)>30000)throw Error('Zeile '+(i+1)+' ist zu groß.');return JSON.parse(l);});
 const get=await fetch(origin,{redirect:'error',signal:AbortSignal.timeout(5000)});if(!get.ok)throw Error('Lokale Arbeitsfläche nicht erreichbar.');
 const token=(await get.text()).match(/name="oa-session" content="([a-f0-9]{64})"/)?.[1];if(!token)throw Error('Keine passende lokale Sitzung.');
 let count=0;for(const event of events){const response=await fetch(new URL('/api/events/ingest',origin),{method:'POST',redirect:'error',signal:AbortSignal.timeout(5000),headers:{'Content-Type':'application/json','x-oa-session':token},body:JSON.stringify({project,event})});if(!response.ok){const result=await response.json();throw Error('Import bei Zeile '+(count+1)+' gestoppt: '+result.error+' Frühere Zeilen können bereits gespeichert sein. Unveränderte Datei ist erneut importierbar.');}await response.body.cancel();count++;}
 console.log(count+' Ereignisse verarbeitet. Keine Sessions gestartet oder Nachrichten versandt.');
}catch(error){console.error(error.code?'Lokale Datei/Verbindung konnte nicht gelesen werden.':error.message);process.exitCode=1;}
