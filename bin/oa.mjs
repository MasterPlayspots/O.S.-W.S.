import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { buildPlan } from '../src/core.mjs';
import { inspectProject } from '../src/inspect.mjs';
import { renderPlan } from '../src/render.mjs';

const [command,...argv]=process.argv.slice(2);
const allowed=command==='inspect'?['--root','--project','--scope']:['--inventory','--preferences','--out'];
function flags(args){
 const out={};for(let i=0;i<args.length;i+=2){if(!allowed.includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(out,args[i]))throw new Error('Unknown, missing or duplicate argument');out[args[i]]=args[i+1];}return out;
}
try {
 if(!['inspect','plan'].includes(command))throw new Error('Use inspect --root PATH --project ID --scope business|private; or plan --inventory FILE --preferences FILE [--out NEW_DIRECTORY]');
 const args=flags(argv);
 if(command==='inspect'){
  console.log(JSON.stringify(await inspectProject(args['--root'],{projectId:args['--project'],scope:args['--scope']}),null,2));
 }else{
  if(!args['--inventory']||!args['--preferences'])throw new Error('Both inventory and preferences files are required');
  const read=async path=>{const s=await readFile(path,'utf8');if(Buffer.byteLength(s)>512*1024)throw new Error('Input file too large');return JSON.parse(s);};
  const input=await read(args['--inventory']),preferences=await read(args['--preferences']);
  const plan=buildPlan({inventory:input.inventory||input,preferences});
  const dest=resolve(args['--out']||join('.local',`plan-${Date.now()}`));
  // Refuse overwriting a prior plan; outputs are a reversible local directory.
  await mkdir(dirname(dest),{recursive:true});
  await mkdir(dest,{recursive:false});
  await writeFile(join(dest,'plan.json'),JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
  await writeFile(join(dest,'dashboard.html'),renderPlan(plan),{flag:'wx'});
  console.log(JSON.stringify({status:'planned',output:dest,planId:plan.id,visible:plan.views.desktop.visible.length,connectorTasks:plan.connectorTasks.length,externalActionsExecuted:0},null,2));
 }
}catch(error){console.error(error.message);process.exitCode=1;}
