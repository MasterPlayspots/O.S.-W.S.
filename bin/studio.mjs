import {startApp} from '../src/server.mjs';
const args=process.argv.slice(2);
try {
  let port=4317;const seen=new Set();
  for(let i=0;i<args.length;i++){
    const key=args[i];if(seen.has(key))throw new Error('Doppeltes Argument.');seen.add(key);
    if(key==='--strictPort')continue;
    if(key==='--host'&&args[i+1]==='127.0.0.1'){i++;continue;}
    if(key==='--port'&&/^\d+$/.test(args[i+1]||'')){port=Number(args[++i]);continue;}
    throw new Error('Aufruf: npm start [-- --port 4317]. Nur --host 127.0.0.1 wird unterstützt.');
  }
  const app=await startApp({port});
  console.log(`O.A. Workspaces · ${app.origin}\nLokal gespeichert: .local/profiles · Beenden: Strg+C\nGitHub wird nur nach Klick gelesen. Kein LLM und kein automatischer Executor.`);
  let stopping=false;
  const stop=async()=>{if(stopping)return;stopping=true;await app.close();process.exit(0);};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(error){console.error(error.message);process.exitCode=1;}
