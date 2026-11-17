import {resolve} from 'node:path';
import {startApp} from '../src/server.mjs';
const args=process.argv.slice(2);
try {
  const options={port:4317,projectRoot:process.cwd()};const seen=new Set();
  for(let i=0;i<args.length;i++){
    const key=args[i];if(seen.has(key))throw new Error('Doppeltes Argument.');seen.add(key);
    if(key==='--strictPort')continue;
    if(key==='--host'&&args[i+1]==='127.0.0.1'){i++;continue;}
    if(key==='--port'&&/^\d+$/.test(args[i+1]||'')){options.port=Number(args[++i]);continue;}
    if(['--project-root','--data-dir'].includes(key)&&args[i+1]&&!args[i+1].startsWith('--')){options[key==='--project-root'?'projectRoot':'dataDir']=resolve(args[++i]);continue;}
    if(key==='--allow-file-write'){options.allowFileWrite=true;continue;}
    if(key==='--enable-codex-planner'){options.enableCodexPlanner=true;continue;}
    if(key==='--help'){console.log('npm start -- [--port 4317] [--project-root ABS_PATH] [--data-dir PRIVATE_PATH] [--enable-codex-planner] [--allow-file-write]\nLoopback only. Repo: read after click. Codex and file writes opt-in.');process.exit(0);}
    throw new Error('Unbekanntes Argument. npm start -- --help zeigt die Optionen.');
  }
  const app=await startApp(options);
  console.log(`UNIFORCE AI Workspace · ${app.origin}\nLokaler Einzelplatz · Beenden: Strg+C\nRepo wird erst nach Klick gelesen. Dateiübernahme: ${options.allowFileWrite?'freigegeben':'gesperrt'}. Codex-Planer: ${options.enableCodexPlanner?'freigegeben':'aus'}.`);
  let stopping=false;
  const stop=async()=>{if(stopping)return;stopping=true;await app.close();process.exit(0);};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(error){console.error(error.message);process.exitCode=1;}
