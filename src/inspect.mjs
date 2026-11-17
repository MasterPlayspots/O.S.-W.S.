import { open, realpath } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

/** Inspect one explicitly supplied project root. No recursion, commands or env reads. */
export async function inspectProject(root,{projectId,scope,now=Date.now()}={}) {
  if(typeof root!=='string'||!root) throw new Error('An explicit project root is required');
  if(!/^[a-zA-Z0-9._-]{1,80}$/.test(projectId||'')||!['private','business'].includes(scope)||!Number.isFinite(now)) throw new Error('Explicit project id, scope and valid time are required');
  const resolved=await realpath(root);
  const handle=await open(join(resolved,'package.json'),constants.O_RDONLY|constants.O_NOFOLLOW);
  let pkg;
  try {
    const stat=await handle.stat();
    if(!stat.isFile()||stat.size>256*1024) throw new Error('package.json must be a regular file <=256 KiB');
    const buffer=Buffer.alloc(256*1024+1);let offset=0;
    while(offset<buffer.length){const {bytesRead}=await handle.read(buffer,offset,buffer.length-offset,null);if(!bytesRead)break;offset+=bytesRead;}
    if(offset>256*1024)throw new Error('package.json exceeds the bounded read');
    pkg=JSON.parse(buffer.subarray(0,offset).toString('utf8'));
  } finally {await handle.close();}
  if(!pkg||typeof pkg!=='object'||Array.isArray(pkg)) throw new Error('Invalid package.json object');
  // Only aggregate structure is emitted. Names, command strings, values, URLs and versions stay local.
  const count=v=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).length:0;
  return {
    inventory:{project:{id:projectId,scope},sourceMode:'project_metadata',services:[{id:'selected-project',kind:'local',status:'declared_ready',capabilities:['project.metadata.read'],observedAt:new Date(now).toISOString(),expiresAt:new Date(now+15*60000).toISOString(),evidence:'Explicitly selected package.json; aggregated structure only'}]},
    observation:{kind:'node-project',scriptCount:count(pkg.scripts),dependencyCount:count(pkg.dependencies),developmentDependencyCount:count(pkg.devDependencies),moduleType:pkg.type==='module'?'module':'other',contentsOrCommandsExecuted:false,environmentRead:false,networkUsed:false},
    limitations:['No OS-wide application detection','No connected accounts discovered','Metadata is not proof of a working service']
  };
}
