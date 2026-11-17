import {readFile,lstat} from 'node:fs/promises';
import {context} from '../web/modules/contracts.js';
// Explicit local metadata import only. Never scans a home directory or reads CLI auth.
try {
 const args=process.argv.slice(2),options={url:'http://127.0.0.1:4317',project:'workspace-core',scope:'business'};
 for(let i=0;i<args.length;i++){
  if(args[i]==='--help'){console.log('node bin/bridge.mjs --file /private/events.jsonl [--url http://127.0.0.1:4317] [--project workspace-core] [--scope business|private]\nImports normalized metadata only; event IDs make retries idempotent.');process.exit(0);}
  const key=args[i].replace(/^--/,'');if(!['file','url','project','scope'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))throw Error('Invalid arguments; use --help.');options[key]=args[++i];
 }
 if(!options.file)throw Error('An explicitly selected JSONL file is required.');
 const info=await lstat(options.file);if(!info.isFile()||info.isSymbolicLink()||info.size>2097152)throw Error('Only regular JSONL files up to 2 MiB are allowed.');
 const origin=new URL(options.url);if(origin.protocol!=='http:'||origin.hostname!=='127.0.0.1'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('Only a direct local HTTP address without credentials is allowed.');
 const project=context({id:options.project,scope:options.scope}),lines=(await readFile(options.file,'utf8')).split('\n').filter(l=>l.trim());if(!lines.length||lines.length>1000)throw Error('Between 1 and 1000 events are required.');
 const events=lines.map((l,i)=>{if(Buffer.byteLength(l)>30000)throw Error('Line '+(i+1)+' is too large.');return JSON.parse(l);});
 const get=await fetch(origin,{redirect:'error',signal:AbortSignal.timeout(5000)});if(!get.ok)throw Error('Local workspace is unreachable.');
 const token=(await get.text()).match(/name="oa-session" content="([a-f0-9]{64})"/)?.[1];if(!token)throw Error('No matching local session.');
 let count=0;for(const event of events){const response=await fetch(new URL('/api/events/ingest',origin),{method:'POST',redirect:'error',signal:AbortSignal.timeout(5000),headers:{'Content-Type':'application/json','x-oa-session':token},body:JSON.stringify({project,event})});if(!response.ok){const result=await response.json();throw Error('Import stopped at line '+(count+1)+': '+result.error+' Earlier lines may already be saved. You can import the unchanged file again.');}await response.body.cancel();count++;}
 console.log(count+' events processed. No sessions started or messages sent.');
}catch(error){console.error(error.code?'Could not read the local file or connection.':error.message);process.exitCode=1;}
