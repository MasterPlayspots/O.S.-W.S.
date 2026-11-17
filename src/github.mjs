/** Explicit, token-free reads of one public repository. Never follows redirects. */
export function repositoryName(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})\/[a-zA-Z0-9._-]{1,100}$/.test(value) || ['.','..'].includes(value.split('/')[1])) {
    throw new Error('Repository als owner/name angeben, ohne URL oder Zugangsdaten.');
  }
  return value;
}

export class ConnectorError extends Error {
  constructor(code, message) { super(message); this.code=code; }
}

export async function readPublicRepository(name, {fetchImpl=fetch, now=Date.now, timeoutMs=8000}={}) {
  repositoryName(name);
  const url=`https://api.github.com/repos/${name.split('/').map(encodeURIComponent).join('/')}`;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  let response;
  try {
    response=await fetchImpl(url, {method:'GET',redirect:'manual',signal:controller.signal,headers:{
      Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10','User-Agent':'OA-Workspaces-Public-Reader/0.2'
    }});
    if (response.status!==200) {
      const code=response.status===404?'not_found': [403,429].includes(response.status)?'rate_or_access_limit':response.status>=300&&response.status<400?'redirect_refused':'upstream_error';
      throw new ConnectorError(code, {not_found:'Öffentliches Repository nicht gefunden.',rate_or_access_limit:'GitHub begrenzt den Zugriff. Bitte später erneut versuchen.',redirect_refused:'Repository wurde verschoben. Bitte den aktuellen Namen eingeben.',upstream_error:'GitHub konnte die Quelle nicht liefern.'}[code]);
    }
    if (!response.headers.get('content-type')?.includes('json')) throw new ConnectorError('invalid_response','GitHub lieferte keine JSON-Antwort.');
    if (Number(response.headers.get('content-length'))>262144) throw new ConnectorError('oversize','Antwort überschreitet die Lesegrenze.');
    const chunks=[]; let size=0;
    for await (const chunk of response.body) {
      size+=chunk.byteLength;
      if(size>262144) throw new ConnectorError('oversize','Antwort überschreitet die Lesegrenze.');
      chunks.push(Buffer.from(chunk));
    }
    const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const str=(v,max)=>typeof v==='string' && v.length<=max;
    if(data.private!==false || data.visibility!=='public' || !str(data.full_name,140) || data.full_name.toLowerCase()!==name.toLowerCase() ||
      !str(data.default_branch,255) || !(data.language===null||str(data.language,80)) || typeof data.archived!=='boolean' ||
      !['stargazers_count','open_issues_count'].every(k=>Number.isSafeInteger(data[k])&&data[k]>=0) ||
      !(data.pushed_at===null||(str(data.pushed_at,40)&&Number.isFinite(Date.parse(data.pushed_at))))) {
      throw new ConnectorError('invalid_response','Repository-Antwort passt nicht zum angefragten öffentlichen Projekt.');
    }
    const observed=now();
    // Allowlist only: no owner profile, description, email, raw API payload or credentials.
    return {repository:data.full_name,url:`https://github.com/${data.full_name}`,visibility:'public',defaultBranch:data.default_branch,
      language:data.language,stars:data.stargazers_count,openIssuesAndPRs:data.open_issues_count,archived:data.archived,pushedAt:data.pushed_at,
      observedAt:new Date(observed).toISOString(),expiresAt:new Date(observed+15*60*1000).toISOString(),
      evidence:{method:'GET',url,apiVersion:'2026-03-10'},access:'anonymous_public_read'};
  } catch(error) {
    if(error instanceof ConnectorError) throw error;
    throw new ConnectorError(controller.signal.aborted?'timeout':'network_or_response_error',controller.signal.aborted?'GitHub antwortet nicht rechtzeitig.':'GitHub ist nicht erreichbar oder lieferte ungültige Daten.');
  } finally {
    clearTimeout(timer);
    if(response?.body && !response.bodyUsed) await response.body.cancel().catch(()=>{});
  }
}
