import {readFile} from 'node:fs/promises';
import {fields,text} from '../web/modules/contracts.js';

export const defaultBrand=Object.freeze({schemaVersion:1,name:'O.A. - O.S',tagline:'Your tools. One workspace.',monogram:'O.A.',website:'https://ourark.io',theme:'dark',accent:'#8DD7BA'});
export function validateBrand(value){
 fields(value,Object.keys(defaultBrand),'Brand');
 const b={...defaultBrand,...value};
 if(b.schemaVersion!==1||!['dark','light'].includes(b.theme)||!/^#[a-f\d]{6}$/i.test(b.accent))throw Error('Invalid brand version, color or theme.');
 text(b.name,40);text(b.tagline,100);text(b.monogram,8);
 const url=new URL(b.website);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('The brand website must be an HTTPS URL without credentials.');
 return b;
}
export async function loadBrand(file){
 if(!file)return {...defaultBrand};
 const data=await readFile(file);if(data.length>8192)throw Error('Brand configuration is too large.');
 return validateBrand(JSON.parse(data.toString('utf8')));
}
