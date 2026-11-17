import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,writeFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {request} from 'node:http';
import {readPublicRepository,repositoryName} from '../src/github.mjs';
import {openStore,projectKey} from '../src/store.mjs';
import {startApp} from '../src/server.mjs';

const preferences=JSON.parse(await readFile(new URL('../examples/preferences.json',import.meta.url)));
const profile=()=>({preferences:structuredClone(preferences),repository:'sample/project'});
const payload=()=>({private:false,visibility:'public',full_name:'sample/project',default_branch:'main',language:'JavaScript',archived:false,stargazers_count:3,open_issues_count:7,pushed_at:'2026-11-17T12:00:00Z',description:'UNTRUSTED_IGNORE_RULES',owner:{email:'NEVER_RETURN'},token:'NEVER_RETURN'});
const response=(data=payload())=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
const NOW=Date.parse('2026-11-17T16:00:00Z');

test('GitHub reader uses one fixed anonymous GET and returns only allowed metadata',async()=>{
  let calls=0;
  const result=await readPublicRepository('sample/project',{now:()=>NOW,fetchImpl:async(url,init)=>{
    calls++;assert.equal(url,'https://api.github.com/repos/sample/project');assert.equal(init.method,'GET');assert.equal(init.redirect,'manual');assert.equal(init.headers['X-GitHub-Api-Version'],'2026-03-10');assert.ok(!('Authorization' in init.headers));return response();
  }});
  assert.equal(calls,1);assert.equal(result.openIssuesAndPRs,7);assert.equal(result.expiresAt,'2026-11-17T16:15:00.000Z');
  assert.ok(!/UNTRUSTED|NEVER_RETURN|description|email|token/.test(JSON.stringify(result)));
});
test('GitHub names cannot select arbitrary URLs, paths, credentials or dot segments',()=>{
  for(const value of ['https://github.com/a/b','a/..','a/.','a/b?token=x','a/b#fragment','a/b/c','a/%2e%2e','a/b@local','a/b\\c','a/b\n']) assert.throws(()=>repositoryName(value));
  assert.equal(repositoryName('MasterPlayspots/O.S.-W.S.'),'MasterPlayspots/O.S.-W.S.');
});
test('GitHub access failures, redirects, private and mismatched responses never become connections',async()=>{
  for(const status of [301,302,404,403,429,500])await assert.rejects(readPublicRepository('sample/project',{fetchImpl:async()=>new Response('failure',{status})}));
  for(const data of [{...payload(),private:true},{...payload(),visibility:'private'},{...payload(),full_name:'other/repo'},{...payload(),stargazers_count:'3'}])await assert.rejects(readPublicRepository('sample/project',{fetchImpl:async()=>response(data)}),{code:'invalid_response'});
});
test('GitHub response limit covers streaming and advertised lengths',async()=>{
  await assert.rejects(readPublicRepository('sample/project',{fetchImpl:async()=>new Response('x'.repeat(262145),{headers:{'Content-Type':'application/json'}})}),{code:'oversize'});
  await assert.rejects(readPublicRepository('sample/project',{fetchImpl:async()=>new Response('{}',{headers:{'Content-Type':'application/json','Content-Length':'262145'}})}),{code:'oversize'});
});
test('GitHub timeout aborts reads and reports a retryable failure',async()=>{
  await assert.rejects(readPublicRepository('sample/project',{timeoutMs:10,fetchImpl:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('abort')),{once:true}))}),{code:'timeout'});
});
test('profiles persist across restart and scopes stay separate',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'oa-store-'));let store=await openStore(dir);
  try{
    const one=await store.save(profile(),0);assert.equal(one.revision,1);
    const privateProject={...preferences.project,scope:'private'};assert.equal((await store.read(privateProject)).revision,0);
    await store.close();store=await openStore(dir);assert.deepEqual((await store.read(preferences.project)).profile,profile());
    const data=await readFile(join(dir,projectKey(preferences.project)+'.json'),'utf8');assert.ok(!data.includes('observedAt'));
  }finally{await store.close();await rm(dir,{recursive:true,force:true});}
});
test('concurrent revisions conflict without overwriting the winning profile',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'oa-race-')),store=await openStore(dir);
  try{
    const other=profile();other.preferences.appearance.depth=99;
    const results=await Promise.allSettled([store.save(profile(),0),store.save(other,0)]);
    assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.revision,1);
    assert.equal((await store.read(preferences.project)).profile.preferences.appearance.depth,preferences.appearance.depth);
    await assert.rejects(openStore(dir),/gesperrt/);
  }finally{await store.close();await rm(dir,{recursive:true,force:true});}
});
test('invalid profiles and corrupt stored state do not silently overwrite data',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'oa-invalid-')),store=await openStore(dir);
  try{
    assert.throws(()=>store.save({...profile(),token:'REJECT_THIS'},0));assert.throws(()=>store.save(profile(),-1));assert.throws(()=>projectKey({id:'../../x',scope:'business'}));
    const path=join(dir,projectKey(preferences.project)+'.json');await writeFile(path,'broken');
    await assert.rejects(store.save(profile(),0));assert.equal(await readFile(path,'utf8'),'broken');
  }finally{await store.close();await rm(dir,{recursive:true,force:true});}
});

async function fixture(t){
  const dir=await mkdtemp(join(tmpdir(),'oa-http-'));let count=0,clock=NOW;
  const source=await readPublicRepository('sample/project',{now:()=>NOW,fetchImpl:async()=>response()});
  const app=await startApp({port:0,dataDir:dir,now:()=>clock,reader:async()=>{count++;return source;}});
  t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true});});
  const html=await (await fetch(app.origin)).text(),session=html.match(/name="oa-session" content="([a-f0-9]+)"/)[1];
  const call=(path,body,headers={})=>fetch(app.origin+path,{method:body===undefined?'GET':'POST',headers:{'x-oa-session':session,...(body===undefined?{}:{'Content-Type':'application/json'}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
  return {app,call,dir,html,get count(){return count;},advance(ms){clock+=ms;}};
}
test('HTTP API requires local host/origin and a session for reading or writing profiles',async t=>{
  const f=await fixture(t);
  assert.equal((await fetch(f.app.origin+'/api/profile?project=x&scope=business')).status,403);
  for(const headers of [{Origin:'https://evil.example'},{'Sec-Fetch-Site':'cross-site'},{'x-oa-session':'wrong'}])assert.equal((await f.call('/api/preview',{profile:profile()},headers)).status,403,JSON.stringify(headers));
  // Fetch normalizes Host; use a raw HTTP request to actually exercise rebinding protection.
  const hostileHost=await new Promise((resolve,reject)=>{const req=request(f.app.origin,{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
  assert.equal(hostileHost,403);
  assert.equal((await f.call('/api/preview',{profile:profile()},{'Content-Type':'text/plain'})).status,400);
  const res=await fetch(f.app.origin);assert.match(res.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(res.headers.get('cache-control'),'no-store');
  assert.ok(!f.html.includes('__SESSION__'));assert.equal(f.count,0);
});
test('end-to-end preview, explicit read, scoped cache, expiry, revision conflict and reload',async t=>{
  const f=await fixture(t),p=profile(),body={profile:p};
  let preview=await (await f.call('/api/preview',body)).json();assert.equal(preview.source,null);assert.equal(f.count,0);
  assert.equal((await f.call('/api/github',{project:p.preferences.project,repository:p.repository})).status,200);assert.equal(f.count,1);
  assert.equal((await (await f.call('/api/github',{project:p.preferences.project,repository:p.repository})).json()).cached,true);assert.equal(f.count,1);
  preview=await (await f.call('/api/preview',body)).json();assert.equal(preview.sourceFresh,true);assert.equal(preview.plan.dots.find(d=>d.capability==='project.metadata.read').resolution.status,'declared_available');assert.equal(preview.plan.autonomy.externalActionsExecuted,0);
  const privateProfile=profile();privateProfile.preferences.project.scope='private';assert.equal((await (await f.call('/api/preview',{profile:privateProfile})).json()).source,null);
  const saved=await f.call('/api/profile',{profile:p,baseRevision:0});assert.equal(saved.status,200);assert.equal((await saved.json()).revision,1);
  assert.equal((await f.call('/api/profile',{profile:p,baseRevision:0})).status,409);
  assert.equal((await (await f.call('/api/profile', {profile:{...p,token:'REJECT'},baseRevision:1})).json()).error,'Ungültige Profilfelder.');
  const loaded=await (await f.call(`/api/profile?project=${p.preferences.project.id}&scope=business`)).json();assert.deepEqual(loaded.profile,p);
  f.advance(15*60*1000);preview=await (await f.call('/api/preview',body)).json();assert.equal(preview.sourceFresh,false);assert.equal(preview.plan.dots.find(d=>d.capability==='project.metadata.read').resolution.status,'stale');assert.equal(f.count,1);
  assert.ok(!(await readdir(f.dir)).some(name=>name.includes('github')));
});
test('failed connector calls do not produce observations or repeated immediate retries',async t=>{
  const dir=await mkdtemp(join(tmpdir(),'oa-failed-'));let calls=0;
  const app=await startApp({port:0,dataDir:dir,reader:async()=>{calls++;throw new Error('Offline');}});t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true});});
  const html=await(await fetch(app.origin)).text(),session=html.match(/name="oa-session" content="([a-f0-9]+)"/)[1];
  const post=body=>fetch(app.origin+'/api/github',{method:'POST',headers:{'Content-Type':'application/json','x-oa-session':session},body:JSON.stringify(body)});
  const body={project:preferences.project,repository:'sample/project'};
  assert.equal((await post(body)).status,400);assert.equal((await post(body)).status,429);assert.equal(calls,1);
});
