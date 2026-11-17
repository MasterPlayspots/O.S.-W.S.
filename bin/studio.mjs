import {resolve} from 'node:path';
import {startApp} from '../src/server.mjs';
const args=process.argv.slice(2);
try {
  const options={port:4317,projectRoot:process.cwd()};const seen=new Set();
  for(let i=0;i<args.length;i++){
    const key=args[i];if(seen.has(key))throw new Error('Duplicate argument.');seen.add(key);
    if(key==='--strictPort')continue;
    if(key==='--host'&&args[i+1]==='127.0.0.1'){i++;continue;}
    if(key==='--port'&&/^\d+$/.test(args[i+1]||'')){options.port=Number(args[++i]);continue;}
    if(['--project-root','--data-dir','--brand-config','--connections-config'].includes(key)&&args[i+1]&&!args[i+1].startsWith('--')){options[{'--project-root':'projectRoot','--data-dir':'dataDir','--brand-config':'brandConfig','--connections-config':'connectionsConfig'}[key]]=resolve(args[++i]);continue;}
    if(key==='--allow-file-write'){options.allowFileWrite=true;continue;}
    if(key==='--enable-codex-planner'){options.enableCodexPlanner=true;continue;}
    if(key==='--help'){console.log('npm start -- [--port 4317] [--project-root ABS_PATH] [--data-dir PRIVATE_PATH] [--brand-config FILE] [--connections-config FILE] [--enable-codex-planner] [--allow-file-write]\nLoopback only. Repo: read after click. Codex and file writes opt-in.');process.exit(0);}
    throw new Error('Unknown argument. Run npm start -- --help to see the options.');
  }
  const app=await startApp(options);
  console.log(`O.A. - O.S · ourark.io · ${app.origin}\nLocal single-user workspace · Stop: Ctrl+C\nRepository is read only after a click. File writes: ${options.allowFileWrite?'enabled':'disabled'}. Codex planner: ${options.enableCodexPlanner?'enabled':'off'}.`);
  let stopping=false;
  const stop=async()=>{if(stopping)return;stopping=true;await app.close();process.exit(0);};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(error){console.error(error.message);process.exitCode=1;}
