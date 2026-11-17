import {createWorkspaceApi} from './workspace/routes.mjs';
import {loadBrand} from './brand.mjs';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {buildPlan} from './core.mjs';
import {openStore,validateProfile,ConflictError,projectKey} from './store.mjs';
import {readPublicRepository,repositoryName,ConnectorError} from './github.mjs';

const assets=new Map([['/',['workspace.html','text/html; charset=utf-8']],['/app.js',['app.js','text/javascript; charset=utf-8']],['/style.css',['style.css','text/css; charset=utf-8']]]);
for (const [url,file,type] of [
 ['/setup','index.html','text/html'],
 ['/workspace.js','workspace.js','text/javascript'],
 ['/workspace.css','workspace.css','text/css'],
 ['/tokens.css','tokens.css','text/css'],
 ['/brand/oaos-mark.svg','brand/oaos-mark.svg','image/svg+xml'],
 ...['contracts','window-manager','panes','event-client','ui','brand','integrations'].map(n=>['/modules/'+n+'.js','modules/'+n+'.js','text/javascript'])
]) assets.set(url,[file,type+'; charset=utf-8']);
function fields(value,allowed) {
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!allowed.includes(k))) throw new Error('Ungültige Anfragefelder.');
}
async function jsonBody(req,limit=32768) {
  if(req.headers['content-type']!=='application/json') throw new Error('JSON erforderlich.');
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>limit)throw new Error('Anfrage zu groß.');chunks.push(chunk);}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

/** Loopback-only single-user development app, not a multi-user authentication service. */
export async function startApp({port=4317,dataDir='.local/profiles',reader=readPublicRepository,now=Date.now,projectRoot=null,allowFileWrite=false,enableCodexPlanner=false,repoProject,brandConfig=null,connectionsConfig=null}={}) {
  if(!Number.isInteger(port)||port<0||port>65535) throw new Error('Ungültiger Port.');
  const brand=await loadBrand(brandConfig),store=await openStore(dataDir),session=randomBytes(32).toString('hex');
  let workspace;try{workspace=await createWorkspaceApi({dataDir,projectRoot,allowFileWrite,enableCodexPlanner,repoProject,connectionsConfig,now});}catch(e){await store.close();throw e;}
  const sources=new Map(),attempts=new Map();let requestsInFlight=0,origin;
  const sourceKey=(project,name)=>projectKey(project)+':'+name.toLowerCase();
  function result(profile) {
    const valid=validateProfile(profile),source=valid.repository?sources.get(sourceKey(valid.preferences.project,valid.repository))||null:null;
    const services=source?[{id:'github-public',kind:'api',status:'declared_ready',capabilities:['project.metadata.read'],observedAt:source.observedAt,expiresAt:source.expiresAt,evidence:`GET ${source.evidence.url}`}]:[];
    return {plan:buildPlan({preferences:valid.preferences,inventory:{project:valid.preferences.project,sourceMode:'declared_inventory',services},now:now()}),source,
      sourceFresh:!!source&&Date.parse(source.observedAt)<=now()&&now()<Date.parse(source.expiresAt)};
  }
  const server=createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    const send=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
    try {
      if(req.headers.host!==new URL(origin).host || (req.headers.origin&&req.headers.origin!==origin) || req.headers['sec-fetch-site']==='cross-site') return send(403,{error:'Zugriff nur über die lokale App-Adresse.'});
      const url=new URL(req.url,origin);
      if(req.method==='GET'&&assets.has(url.pathname)) {
        const [file,type]=assets.get(url.pathname);let content=await readFile(new URL('../web/'+file,import.meta.url));
        if(file==='index.html'||file==='workspace.html') content=Buffer.from(content.toString().replace('__SESSION__',session));
        res.writeHead(200,{'Content-Type':type});return res.end(content);
      }
      if(req.headers['x-oa-session']!==session) return send(403,{error:'Lokale Sitzung fehlt. App neu laden.'});
      if(req.method==='GET'&&url.pathname==='/api/brand')return send(200,brand);
      if(req.method==='GET'&&await workspace.handle({req,res,url,send}))return;
      if(req.method==='GET'&&url.pathname==='/api/profile') {
        const project={id:url.searchParams.get('project'),scope:url.searchParams.get('scope')};
        const state=await store.read(project);return send(200,{...state,...(state.profile?result(state.profile):{})});
      }
      if(req.method!=='POST') return send(404,{error:'Nicht gefunden.'});
      const input=await jsonBody(req,url.pathname.startsWith('/api/workspace')||url.pathname.startsWith('/api/files')||url.pathname.startsWith('/api/assistant')?131072:32768);
      if(await workspace.handle({req,res,url,input,send}))return;
      if(url.pathname==='/api/preview') {fields(input,['profile']);return send(200,result(input.profile));}
      if(url.pathname==='/api/profile') {
        fields(input,['profile','baseRevision']);const preview=result(input.profile);
        const state=await store.save(input.profile,input.baseRevision);return send(200,{...state,...preview});
      }
      if(url.pathname==='/api/github') {
        fields(input,['project','repository']);const name=repositoryName(input.repository),key=sourceKey(input.project,name);
        const cached=sources.get(key);
        if(cached&&Date.parse(cached.expiresAt)>now()) return send(200,{source:cached,cached:true});
        if(requestsInFlight>=2 || (attempts.has(key)&&now()-attempts.get(key)<30000)) return send(429,{error:'Bitte kurz warten, bevor du erneut liest.'});
        // Bound in-memory metadata; no periodic polling or automatic reconnect.
        if(attempts.size>=100)attempts.delete(attempts.keys().next().value);
        attempts.set(key,now());requestsInFlight++;
        try {
          const source=await reader(name);if(sources.size>=100)sources.delete(sources.keys().next().value);sources.set(key,source);
          return send(200,{source,cached:false});
        }finally{requestsInFlight--;}
      }
      return send(404,{error:'Nicht gefunden.'});
    }catch(error){
      if(error.status===409)return send(409,{error:error.message});
      if(error instanceof ConflictError)return send(409,{error:error.message,currentRevision:error.revision});
      if(error instanceof ConnectorError)return send(502,{error:error.message,code:error.code});
      // Filesystem failures must not leak local paths or silently reset a profile.
      if(error.code || error instanceof SyntaxError)return send(400,{error:'Eingabe oder gespeicherter Zustand konnte nicht gelesen werden.'});
      return send(400,{error:error.message});
    }
  });
  server.requestTimeout=10000;server.headersTimeout=10000;
  try {await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}
  catch(error){await workspace.close();await store.close();throw error;}
  origin=`http://127.0.0.1:${server.address().port}`;
  return {origin,async close(){await workspace.close();await new Promise((resolve,reject)=>{server.close(e=>e?reject(e):resolve());server.closeIdleConnections();});await store.close();}};
}
