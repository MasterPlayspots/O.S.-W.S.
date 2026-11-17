export function connectEvents({url,session,after=0,onEvent,onState}){
 const controller=new AbortController();let cursor=after,stopped=false;
 const wait=ms=>new Promise(resolve=>{const done=()=>{clearTimeout(id);controller.signal.removeEventListener('abort',done);resolve();};const id=setTimeout(done,ms);controller.signal.addEventListener('abort',done,{once:true});});
 (async()=>{
  while(!stopped){
   try{
    const next=new URL(url);next.searchParams.set('after',cursor);
    const response=await fetch(next,{headers:{'x-oa-session':session},signal:controller.signal});
    if(!response.ok)throw Error('Ereigniskanal nicht erreichbar ('+response.status+').');
    onState('connected');const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
    while(!stopped){
     const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});
     if(buffer.length>65536)throw Error('Ereignis zu groß.');
     let end;while((end=buffer.indexOf('\n\n'))>=0){
      const block=buffer.slice(0,end);buffer=buffer.slice(end+2);
      for(const line of block.split('\n'))if(line.startsWith('data: ')){
       const event=JSON.parse(line.slice(6));if(event.type==='heartbeat'||event.type==='connected'){onState('connected');continue;}
       if(event.type==='resync'){cursor=event.cursor;onEvent(event);continue;}
       if(Number.isSafeInteger(event.cursor)&&event.cursor>cursor){cursor=event.cursor;onEvent(event);}
      }
     }
    }
    if(!stopped)throw Error('Ereigniskanal getrennt.');
   }catch(error){if(stopped)break;onState('reconnecting');}
   await wait(2500);
  }
 })();
 return ()=>{stopped=true;controller.abort();};
}
