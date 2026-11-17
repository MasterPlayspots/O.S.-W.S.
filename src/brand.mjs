import {readFile} from 'node:fs/promises';
import {fields,text} from '../web/modules/contracts.js';

export const defaultBrand=Object.freeze({schemaVersion:1,name:'O.A. - O.S',tagline:'Your tools. One workspace.',monogram:'O.A.',website:'https://ourark.io',theme:'dark',accent:'#F76B5C'});
export function validateBrand(value){
 fields(value,Object.keys(defaultBrand),'Brand');
 const b={...defaultBrand,...value};
 if(b.schemaVersion!==1||!['dark','light'].includes(b.theme)||!/^#[a-f\d]{6}$/i.test(b.accent))throw Error('Ungültige Brand-Version, Farbe oder Theme.');
 text(b.name,40);text(b.tagline,100);text(b.monogram,8);
 const url=new URL(b.website);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Brand-Website muss eine HTTPS-Adresse ohne Zugangsdaten sein.');
 return b;
}
export async function loadBrand(file){
 if(!file)return {...defaultBrand};
 const data=await readFile(file);if(data.length>8192)throw Error('Brand-Konfiguration zu groß.');
 return validateBrand(JSON.parse(data.toString('utf8')));
}
