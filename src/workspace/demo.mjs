import {clone} from '../../web/modules/contracts.js';
const rect=(x,y,w=4,h=4)=>({x,y,w,h});
const window=(id,kind,title,taskId,sessionId,fileId,x,y)=>({id,kind,title,taskId,sessionId,fileId,pinned:false,minimized:false,closed:false,rect:rect(x,y),mobileOrder:y*3+x/4,level:kind==='code'?0:1});
export function defaultLayout(){return {schemaVersion:1,theme:'oaos',pages:[
 {id:'workspace',title:'Workspace',windows:[
 window('code-frontend','code','Frontend · Workspace','layout','frontend','demo:frontend',0,0),
 window('code-backend','code','Backend · Events','events','backend','demo:backend',4,0),
 window('code-tests','code','Tests · Usage & Review','review','review','demo:tests',8,0),
 window('session-frontend','session','Claude · Frontend','layout','frontend',null,0,4),
 window('session-backend','session','Codex · Backend','events','backend',null,4,4),
 window('session-review','session','Gemini · Review','review','review',null,8,4)]},
 {id:'planning',title:'Planning & knowledge',windows:[
 window('task-list','tasks','Tasks & decisions',null,null,null,0,0),
 window('project-notes','notes','Project knowledge',null,null,'note:project',4,0),
 window('project-usage','usage','Models & usage',null,null,null,8,0)]},
 {id:'handoff',title:'Review & handoff',windows:[
 window('review-code','code','Review test cases','review','review','demo:tests',0,0),
 window('review-dialog','session','Review session','review','review',null,4,0),
 window('handoff-notes','notes','Prepare handoff',null,null,'note:handoff',8,0)]}
]};}
const at='2026-11-17T09:30:00.000Z';
export const demoFiles={
 'demo:frontend':{name:'workspace-shell.js',content:"// DEMO · editable local draft\nexport function createWorkspace(project) {\n  return {\n    projectId: project.id,\n    windows: [],\n    preserveFocus: true,\n    layoutMode: '2d',\n    source: 'demo'\n  };\n}\n\nexport function focusTask(workspace, taskId) {\n  return workspace.windows.filter(\n    window => window.taskId === taskId\n  );\n}\n",quality:'demo'},
 'demo:backend':{name:'session-events.mjs',content:"// DEMO · not a production event service\nconst seen = new Set();\n\nexport function acceptEvent(event) {\n  if (seen.has(event.eventId)) return false;\n  seen.add(event.eventId);\n  return {\n    sessionId: event.sessionId,\n    effectiveModelId: event.modelId ?? null,\n    source: 'demo'\n  };\n}\n",quality:'demo'},
 'demo:tests':{name:'usage.test.mjs',content:"// DEMO · example, not test evidence\nimport assert from 'node:assert/strict';\nimport { test } from 'node:test';\n\ntest('missing usage remains unknown', () => {\n  const usage = { input: null, output: null };\n  assert.equal(usage.input, null);\n});\n\ntest('snapshot replaces earlier count', () => {\n  const snapshots = [1200, 2200];\n  assert.equal(snapshots.at(-1), 2200);\n});\n",quality:'demo'}
};
export function demoData(){
 const tasks=Array.from({length:20},(_,i)=>({id:i===12?'layout':i===13?'events':i===14?'review':'task-'+i,title:i===12?'Design session headers':i===13?'Record usage correctly':i===14?'Review changes':'Work item '+(i+1),status:i<12?'accepted':i===14?'blocked':'in_progress',acceptedCount:i===12?6:3,eligibleCount:i===12?8:6,quality:'demo'}));
 const sessions=[
 {id:'frontend',taskId:'layout',agent:'Frontend',runtime:'Claude Code',provider:'Demo adapter',requestedModelId:'sonnet-demo',effectiveModelId:'sonnet-demo',state:'running',contextUsed:56000,contextLimit:200000,capabilities:[],startedAt:at,heartbeatAt:at,quality:'demo',nextStep:'Review headers and grid',branch:'demo/layout'},
 {id:'backend',taskId:'events',agent:'Backend',runtime:'Codex',provider:'Demo adapter',requestedModelId:'codex-demo',effectiveModelId:'codex-demo',state:'waiting',contextUsed:null,contextLimit:null,capabilities:[],startedAt:at,heartbeatAt:at,quality:'demo',nextStep:'Check deduplication',branch:'demo/events'},
 {id:'review',taskId:'review',agent:'Review',runtime:'Gemini',provider:'Demo adapter',requestedModelId:'gemini-demo',effectiveModelId:'gemini-demo',state:'review',contextUsed:null,contextLimit:null,capabilities:[],startedAt:at,heartbeatAt:at,quality:'demo',nextStep:'Two test cases need clarification',branch:'demo/review'}
 ];
 const usages=sessions.map((s,i)=>({requestId:'demo-request-'+i,attemptId:'1',sessionId:s.id,modelId:s.effectiveModelId,revision:1,final:true,kind:'snapshot',input:[34000,40000,8000][i],output:[8000,21000,17000][i],cacheRead:null,cacheWrite:null,reasoning:null,providerTotal:[42000,61000,25000][i],totalSemantics:'provider_reported',cost:{value:[0.7,1.1,0.6][i],currency:'EUR',quality:'demo',priceVersion:'illustration-only'},source:'synthetic-fixture',quality:'demo',observedAt:at}));
 return clone({title:'Workspace Core',milestone:'Workspace · Iteration 01',tasks,sessions,usages,files:demoFiles,source:{id:'demo',state:'demo',quality:'demo',observedAt:at},events:[{cursor:0,type:'demo.loaded',at,summary:'Sample data — no connected agents.'}]});
}
