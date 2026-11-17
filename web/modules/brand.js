export async function applyBrand(session){
 const res=await fetch('/api/brand',{headers:{'x-oa-session':session}});
 if(!res.ok)throw Error('Could not load the brand configuration.');
 const brand=await res.json();document.documentElement.dataset.theme=brand.theme;
 document.documentElement.style.setProperty('--oa-accent',brand.accent);
 const rgb=brand.accent.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 const luminance=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
 document.documentElement.style.setProperty('--oa-on-accent',(luminance+.05)/(.00825+.05)>=1.05/(luminance+.05)?'#101816':'#FFFFFF');
 for(const e of document.querySelectorAll('[data-brand-name]'))e.textContent=brand.name;
 for(const e of document.querySelectorAll('[data-brand-monogram]'))e.textContent=brand.monogram;
 for(const e of document.querySelectorAll('[data-brand-tagline]'))e.textContent=brand.tagline;
 for(const e of document.querySelectorAll('[data-brand-website]')){e.href=brand.website;e.textContent=new URL(brand.website).host;}
 const link=document.querySelector('.brand');link?.setAttribute('aria-label',brand.name+' · '+brand.tagline);
 return brand;
}
