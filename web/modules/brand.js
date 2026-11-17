export async function applyBrand(session){
 const res=await fetch('/api/brand',{headers:{'x-oa-session':session}});
 if(!res.ok)throw Error('Brand-Konfiguration konnte nicht geladen werden.');
 const brand=await res.json();document.documentElement.dataset.theme=brand.theme;
 document.documentElement.style.setProperty('--oa-accent',brand.accent);
 for(const e of document.querySelectorAll('[data-brand-name]'))e.textContent=brand.name;
 for(const e of document.querySelectorAll('[data-brand-monogram]'))e.textContent=brand.monogram;
 for(const e of document.querySelectorAll('[data-brand-tagline]'))e.textContent=brand.tagline;
 for(const e of document.querySelectorAll('[data-brand-website]')){e.href=brand.website;e.textContent=new URL(brand.website).host;}
 const link=document.querySelector('.brand');link?.setAttribute('aria-label',brand.name+' · '+brand.tagline);
 return brand;
}
