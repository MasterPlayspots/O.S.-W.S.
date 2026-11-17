import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {realpath,lstat,readFile,writeFile,rename,rm} from 'node:fs/promises';
import {resolve,relative,join,dirname,extname,basename} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
const run=promisify(execFile),hash=s=>createHash('sha256').update(s).digest('hex');
const allowed=p=>typeof p==='string'&&p.length<240&&!p.split('/').some(x=>x.startsWith('.')||x==='..')&&!/auth|secrets?|credentials|tokens?|cookies|sessions?|service\.env|oauth/i.test(basename(p))&&['.js','.mjs','.ts','.tsx','.jsx','.json','.md','.css','.html','.txt'].includes(extname(p))&&!p.includes('node_modules/');
const secret=s=>/(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{25,}|-----BEGIN [^\n]*PRIVATE KEY-----)/.test(s);
export async function createRepoReader(directory,{allowWrite=false}={}){
 const root=await realpath(resolve(directory));let snapshot=null,queue=Promise.resolve();
 async function git(args){return (await run('git',['-C',root,...args],{timeout:5000,maxBuffer:1024*1024,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}})).stdout;}
 async function readPath(file){
  if(!allowed(file)||!snapshot?.files.some(f=>f.id===file))throw Error('Datei nicht im freigegebenen Bestand.');
  const path=join(root,file),resolved=await realpath(path);
  if(relative(root,resolved).startsWith('..')||resolved!==path||(await lstat(path)).isSymbolicLink())throw Error('Dateiverweis außerhalb des Projekts.');
  const info=await lstat(path);if(!info.isFile()||info.size>65536)throw Error('Datei nicht lesbar oder größer als 64 KiB.');
  const content=await readFile(path,'utf8');if(content.includes('\0')||secret(content))throw Error('Datei enthält Binärdaten oder ein erkanntes Geheimnismuster.');
  return {id:file,name:file,content,hash:hash(content),quality:'reported',source:'selected-local-repository',observedAt:new Date().toISOString()};
 }
 return {
  async refresh(){
   const [branch,head,files,status,diff]=await Promise.all([git(['branch','--show-current']),git(['rev-parse','HEAD']),git(['ls-files','-z']),git(['status','--porcelain','-z']),git(['diff','--stat','--no-ext-diff'])]);
   snapshot={branch:branch.trim(),head:head.trim(),files:files.split('\0').filter(allowed).slice(0,300).map(id=>({id,name:id})),changedCount:status.split('\0').filter(Boolean).length,diffStat:diff.slice(0,16000),observedAt:new Date().toISOString(),quality:'reported',source:'selected-local-repository',canWrite:allowWrite};
   return snapshot;
  },
  getSnapshot(){return snapshot;},read:readPath,
  write(file,content,baseHash){
   if(!allowWrite)throw Error('Dateischreiben nicht freigegeben. --allow-file-write am Arbeits-Host erforderlich.');
   if(typeof content!=='string'||Buffer.byteLength(content)>65536||secret(content))throw Error('Ungültiger Dateiinhalt.');
   const action=queue.then(async()=>{
    const old=await readPath(file);if(old.hash!==baseHash){const e=Error('Datei wurde inzwischen geändert. Entwurf bleibt erhalten.');e.status=409;throw e;}
    const path=join(root,file),tmp=join(dirname(path),'.uf-'+randomUUID()+'.tmp'),info=await lstat(path);
    try{await writeFile(tmp,content,{flag:'wx',mode:info.mode&0o777});await rename(tmp,path);}finally{await rm(tmp,{force:true});}
    return readPath(file);
   });queue=action.catch(()=>{});return action;
  }
 };
}
