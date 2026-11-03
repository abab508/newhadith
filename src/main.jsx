import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const CHAPTERS = [
 {title:'Croyance et foi',ar:'العقيدة والإيمان',topics:['Foi','Unicité','Destin','Sincérité']},
 {title:'Purification',ar:'الطهارة',topics:['Ablutions','Bain rituel','Eau et pureté','Tayammum']},
 {title:'Prière',ar:'الصلاة',topics:['Prières quotidiennes','Prière collective','Invocations','Sunnas de la prière']},
 {title:'Jeûne et Ramadan',ar:'الصيام ورمضان',topics:['Jeûne','Ramadan','Rupture du jeûne','Nuit du destin']},
 {title:'Mariage et famille',ar:'الزواج والأسرة',topics:['Mariage','Choix des conjoints','Droits des époux','Dot (mahr)','Divorce','Éducation des enfants']},
 {title:'Commerce et affaires',ar:'التجارة والمعاملات',topics:['Éthique commerciale','Vente et contrats','Dettes','Justice des transactions']},
 {title:'Morale et comportement',ar:'الأخلاق والآداب',topics:['Bienveillance','Patience','Respect','Relations humaines']},
 {title:'Signes de la fin des temps',ar:'أشراط الساعة',topics:['Signes mineurs','Signes majeurs','Épreuves','Dernier Jour']}
];
const cards=[[60,505,227,196],[302,505,227,196],[544,505,227,196],[785,505,225,196],[56,717,233,204],[302,717,228,204],[544,717,227,204],[785,717,225,204]];
const pct=(n,d)=>(100*n/d)+'%';
const position=([x,y,w,h])=>({left:pct(x,1448),top:pct(y,1086),width:pct(w,1448),height:pct(h,1086)});
function App(){
 const [active,setActive]=useState(4),[opened,setOpened]=useState(false),[query,setQuery]=useState('');
 const [notice,setNotice]=useState(''),[motion,setMotion]=useState(true),[menu,setMenu]=useState(false),[language,setLanguage]=useState('FR');
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');setMotion(!media.matches);const onChange=()=>setMotion(!media.matches);media.addEventListener('change',onChange);return()=>media.removeEventListener('change',onChange);},[]);
 const select=i=>{setActive(i);setOpened(true);setNotice('');};
 const search=e=>{e.preventDefault();const q=query.trim().toLocaleLowerCase();if(!q)return;const i=CHAPTERS.findIndex(c=>[c.title,c.ar,...c.topics].some(t=>t.toLocaleLowerCase().includes(q)));if(i>=0){select(i)}else setNotice('Aucun chapitre correspondant. Le moteur de recherche des hadiths sera ajouté lors d’une prochaine étape.');};
 const pending=label=>setNotice('« '+label+' » sera créé lors de la prochaine étape. Pour l’instant, seule la page d’accueil est disponible.');
 const ch=CHAPTERS[active];
 return <main className={'site '+(motion?'motion':'still')}>
  <section className="desktop-art" aria-label="Page d’accueil Milaghaiba, inspirée de la capture de référence">
   <img src="/images/reference.webp" className="reference" alt="Milaghaiba : décor islamique nocturne, bibliothèque, mosquée et huit chapitres" />
   <div className="stars" aria-hidden="true" />
   <div className="nav-hotspots" role="navigation" aria-label="Navigation principale">
    <button style={position([127,24,83,44])} onClick={()=>{setOpened(false);setNotice('')}} aria-label="Accueil"/>
    <button style={position([216,24,90,44])} onClick={()=>setMenu(x=>!x)} aria-expanded={menu} aria-label="Menu Thèmes"/>
    <button style={position([326,24,132,44])} onClick={()=>document.querySelector('#desktop-query')?.focus()} aria-label="Recherche"/>
    <button style={position([459,24,99,44])} onClick={()=>pending('Sources')} aria-label="Sources"/>
   </div>
   {menu&&<div className="drop"><button onClick={()=>{setMenu(false);select(4)}}>Choisir un chapitre</button><button onClick={()=>{setMenu(false);pending('Tous les thèmes')}}>Tous les thèmes (bientôt)</button></div>}
   <form className="desk-search" style={position([359,314,687,54])} onSubmit={search}>
    <label className="sr-only" htmlFor="desktop-query">Rechercher un chapitre</label>
    <input id="desktop-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un chapitre…"/>
    <button type="submit" aria-label="Lancer la recherche">Rechercher</button>
   </form>
   {cards.map((c,i)=><button key={i} style={position(c)} className={'hotspot hotspot-'+i+(active===i?' selected':'')} onClick={()=>select(i)} aria-label={'Afficher '+CHAPTERS[i].title} aria-pressed={active===i} />)}
   <div className="langs" style={position([1167,25,128,34])}>{['FR','AR','EN'].map(l=><button key={l} onClick={()=>{setLanguage(l);if(l!=='FR')pending('Langue '+l)}} aria-pressed={language===l}>{l}</button>)}</div>
   {opened&&<div className="details" style={position([1019,397,376,531])}>
    <button className="close" aria-label="Fermer le panneau" onClick={()=>setOpened(false)}>×</button><div className="chapter-title">{ch.title}</div><div className="arabic" lang="ar" dir="rtl">{ch.ar}</div><p>Explorez les enseignements relatifs à ce chapitre.</p><h3>✧ Sous-thèmes ✧</h3>
    {ch.topics.map(t=><button key={t} className="topic" onClick={()=>pending(t)}>{t}<span>›</span></button>)}
   </div>}
  </section>
  <section className="mobile-art">
   <nav className="mobile-top"><span>Accueil</span><button onClick={()=>pending('Thèmes')}>Thèmes ▾</button><button onClick={()=>pending('Sources')}>Sources</button></nav>
   <header className="mobile-hero"><div className="mobile-logo">Milaghaiba</div><div className="arabic" lang="ar" dir="rtl">الملة الغائبة</div><p className="eyebrow">✧ Bibliothèque de hadiths ✧</p><h1>Les grands chapitres de l’islam</h1><p>Les hadiths sont organisés par grands thèmes et sous-thèmes.</p></header>
   <form className="mobile-search" onSubmit={search}><label className="sr-only" htmlFor="mobile-query">Rechercher un chapitre</label><input id="mobile-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un chapitre…"/><button>Rechercher</button></form>
   <h2>✧ Grands chapitres ✧</h2>
   <div className="mobile-grid">{CHAPTERS.map((c,i)=><button key={i} className={'mobile-card '+(active===i?'chosen':'')} onClick={()=>select(i)} aria-pressed={active===i}><img src={'/images/chapitre-'+(i+1)+'.webp'} alt={c.title}/></button>)}</div>
   {opened&&<div className="mobile-details"><h2>{ch.title}</h2><p lang="ar" dir="rtl">{ch.ar}</p>{ch.topics.map(t=><button key={t} onClick={()=>pending(t)}>{t} ›</button>)}</div>}
  </section>
  <div className="controls"><button onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>{motion?'✦ Réduire les animations':'✧ Activer les animations'}</button><span>Accueil uniquement · version de démonstration</span></div>
  {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Fermer le message">×</button></div>}
 </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
