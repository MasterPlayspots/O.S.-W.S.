import {mkdir,readFile,writeFile,rename,rm,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {validatePreferences} from './core.mjs';
import {repositoryName} from './github.mjs';

export function projectKey(project) {
  if(!project || Object.keys(project).some(k=>!['id','scope'].includes(k)) || typeof project.id!=='string' || !/^[a-zA-Z0-9._-]{1,80}$/.test(project.id) || !['private','business'].includes(project.scope)) throw new Error('Ungültiger Projektkontext.');
  return createHash('sha256').update(`${project.scope}:${project.id}`).digest('hex');
}
export function validateProfile(input) {
  if(!input || Object.keys(input).some(k=>!['preferences','repository'].includes(k))) throw new Error('Ungültige Profilfelder.');
  return {preferences:validatePreferences(input.preferences),repository:input.repository===null?null:repositoryName(input.repository)};
}
export class ConflictError extends Error {
  constructor(revision){super('Das Profil wurde zwischenzeitlich geändert. Neu laden und Änderungen erneut prüfen.');this.revision=revision;}
}

/** Single-process, revision-checked local profiles. Lock prevents two writers. */
export async function openStore(directory) {
  const root=resolve(directory); await mkdir(root,{recursive:true,mode:0o700});
  const lock=join(root,'.writer-lock');
  try {await mkdir(lock);} catch(error) {
    if(error.code==='EEXIST') throw new Error('Profilspeicher ist gesperrt. Zweite Instanz beenden; nach einem Absturz .writer-lock nur bei gestoppten Instanzen entfernen.');
    throw error;
  }
  let queue=Promise.resolve();
  async function read(project) {
    const path=join(root,projectKey(project)+'.json');
    try {
      if((await stat(path)).size>65536) throw new Error('Profildatei zu groß.');
      const state=JSON.parse(await readFile(path,'utf8'));
      validateProfile(state.profile);
      if(!Number.isSafeInteger(state.revision)||state.revision<1||projectKey(state.profile.preferences.project)!==projectKey(project)) throw new Error('Ungültiger gespeicherter Zustand.');
      return state;
    } catch(error) {if(error.code==='ENOENT') return {revision:0,profile:null,updatedAt:null};throw error;}
  }
  return {read,
    save(input,baseRevision) {
      const profile=validateProfile(input);
      if(!Number.isSafeInteger(baseRevision)||baseRevision<0) throw new Error('baseRevision muss eine nichtnegative ganze Zahl sein.');
      const run=queue.then(async()=>{
        const current=await read(profile.preferences.project);
        if(current.revision!==baseRevision) throw new ConflictError(current.revision);
        const state={revision:current.revision+1,profile,updatedAt:new Date().toISOString()};
        const path=join(root,projectKey(profile.preferences.project)+'.json'),temp=path+'.'+randomUUID()+'.tmp';
        try {await writeFile(temp,JSON.stringify(state,null,2)+'\n',{flag:'wx',mode:0o600});await rename(temp,path);} finally {await rm(temp,{force:true});}
        return state;
      });
      queue=run.catch(()=>{}); return run;
    },
    async close(){await queue;await rm(lock,{recursive:true,force:true});}
  };
}
