import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const chapters=[
 {id:'foi',title:['Croyance et foi','العقيدة والإيمان','Faith and belief'],topics:[['Foi','الإيمان','Faith'],['Unicité','التوحيد','Monotheism'],['Destin','القدر','Destiny'],['Sincérité','الإخلاص','Sincerity']]},
 {id:'purification',title:['Purification','الطهارة','Purification'],topics:[['Ablutions','الوضوء','Ablution'],['Bain rituel','الغسل','Ritual bath'],['Eau et pureté','الماء والطهارة','Water and purity'],['Tayammum','التيمم','Dry ablution']]},
 {id:'priere',title:['Prière','الصلاة','Prayer'],topics:[['Prières quotidiennes','الصلوات اليومية','Daily prayers'],['Prière collective','صلاة الجماعة','Congregational prayer'],['Invocations','الدعاء','Supplication'],['Sunnas de la prière','سنن الصلاة','Prayer traditions']]},
 {id:'ramadan',title:['Jeûne et Ramadan','الصيام ورمضان','Fasting and Ramadan'],topics:[['Jeûne','الصيام','Fasting'],['Ramadan','رمضان','Ramadan'],['Rupture du jeûne','الإفطار','Breaking the fast'],['Nuit du destin','ليلة القدر','Night of Decree']]},
 {id:'famille',title:['Mariage et famille','الزواج والأسرة','Marriage and family'],topics:[['Mariage','الزواج','Marriage'],['Choix des conjoints','اختيار الزوجين','Choosing a spouse'],['Droits des époux','حقوق الزوجين','Spousal rights'],['Dot (mahr)','المهر','Mahr'],['Divorce','الطلاق','Divorce'],['Éducation des enfants','تربية الأبناء','Raising children']]},
 {id:'commerce',title:['Commerce et affaires','التجارة والمعاملات','Trade and business'],topics:[['Éthique commerciale','أخلاق التجارة','Business ethics'],['Vente et contrats','البيع والعقود','Sales and contracts'],['Dettes','الديون','Debts'],['Justice des transactions','العدل في المعاملات','Fair transactions']]},
 {id:'morale',title:['Morale et comportement','الأخلاق والآداب','Ethics and conduct'],topics:[['Bienveillance','الإحسان','Kindness'],['Patience','الصبر','Patience'],['Respect','الاحترام','Respect'],['Relations humaines','العلاقات الإنسانية','Human relations']]},
 {id:'signes',title:['Signes de la fin des temps','أشراط الساعة','Signs of the Last Hour'],topics:[['Signes mineurs','العلامات الصغرى','Minor signs'],['Signes majeurs','العلامات الكبرى','Major signs'],['Épreuves','الفتن','Trials'],['Dernier Jour','اليوم الآخر','Last Day']]}
];
const tr={
 FR:{search:'Rechercher un hadith, un thème, un mot-clé…',go:'Rechercher',chapters:'Grands chapitres',sub:'Sous-thèmes',intro:'Les enseignements transmis relatifs à',choose:'Choisir un chapitre',soon:'Cette rubrique sera créée lors de la prochaine étape.',no:'Aucun chapitre correspondant.',home:'Accueil',themes:'Thèmes',sources:'Sources'},
 AR:{search:'ابحث عن حديث أو موضوع أو كلمة…',go:'بحث',chapters:'الأبواب الرئيسية',sub:'موضوعات فرعية',intro:'الأحاديث المتعلقة بـ',choose:'اختر بابًا',soon:'سيتم إنشاء هذه الصفحة في المرحلة التالية.',no:'لم يتم العثور على باب مطابق.',home:'الرئيسية',themes:'الموضوعات',sources:'المصادر'},
 EN:{search:'Search a hadith, topic or keyword…',go:'Search',chapters:'Major chapters',sub:'Subtopics',intro:'Narrations related to',choose:'Choose a chapter',soon:'This section will be built in the next stage.',no:'No matching chapter.',home:'Home',themes:'Themes',sources:'Sources'}
};
const coords=[[60,505,227,196],[302,505,227,196],[544,505,227,196],[785,505,225,196],[56,717,233,204],[302,717,228,204],[544,717,227,204],[785,717,225,204]];
const pos=([x,y,w,h])=>({left:(x/1448*100)+'%',top:(y/1086*100)+'%',width:(w/1448*100)+'%',height:(h/1086*100)+'%'});
function App(){
 const [selected,setSelected]=useState(null),[hover,setHover]=useState(null),[panelOpen,setPanelOpen]=useState(false),[lang,setLang]=useState('FR'),[query,setQuery]=useState(''),[notice,setNotice]=useState(''),[menu,setMenu]=useState(false),[motion,setMotion]=useState(true);
 const input=useRef(null),cards=useRef(null);
 useEffect(()=>{document.documentElement.lang=lang.toLowerCase();document.title=lang==='AR'?'ملاغايبة — مكتبة الحديث':lang==='EN'?'Milaghaiba — Hadith Library':'Milaghaiba — Bibliothèque de hadiths';},[lang]);
 const iLang=lang==='AR'?1:lang==='EN'?2:0;
 const selectedIndex=hover??selected, chapter=chapters[selectedIndex??4], t=tr[lang];
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');setMotion(!m.matches);const fn=()=>setMotion(!m.matches);m.addEventListener('change',fn);return()=>m.removeEventListener('change',fn)},[]);
 const choose=i=>{setSelected(i);setPanelOpen(true);setNotice('')};
 const lookup=e=>{e.preventDefault();const q=query.trim().toLocaleLowerCase();if(!q)return;const i=chapters.findIndex(c=>[...c.title,...c.topics.flat()].some(v=>v.toLocaleLowerCase().includes(q)));if(i<0){setNotice(t.no)}else{choose(i);setNotice('');cards.current?.scrollIntoView({behavior:'smooth',block:'center'})}};
 const pending=label=>setNotice(label+' — '+t.soon);
 const card=(c,i,mobile=false)=><button key={c.id} type="button" className={(mobile?'mobile-card':'hotspot')+' '+(mobile&&selected===i?'selected':'')+(hover===i&&!mobile?' hovered':'')} style={mobile?undefined:pos(coords[i])} aria-label={c.title[iLang]} aria-pressed={mobile&&selected===i} onPointerEnter={e=>{if(e.pointerType==='mouse')setHover(i)}} onPointerLeave={e=>{if(e.pointerType==='mouse')setHover(null)}} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} onClick={()=>choose(i)}>
   <img className="chapter-art" src={lang==='FR'?('/images/chapitre-'+(i+1)+(i===4?'-normal':'')+'.webp'):('/images/chapitre-'+(i+1)+'-'+lang.toLowerCase()+'.webp')} alt=""/>
   <span className="card-caption"><strong dir={lang==='AR'?'rtl':'ltr'}>{c.title[iLang]}</strong>{lang!=='AR'&&<span lang="ar" dir="rtl">{c.title[1]}</span>}</span>
  </button>;
 const panel=<div className="panel-copy" key={chapter.id}>
  <h2>{chapter.title[iLang]}</h2>{lang!=='AR'&&<p className="panel-ar" lang="ar" dir="rtl">{chapter.title[1]}</p>}
  <p className="panel-description">{t.intro} {chapter.title[iLang].toLowerCase()}.</p>
  <h3>✧ {t.sub} ✧</h3>
  <div className="topics">{chapter.topics.map((s,j)=><button key={j} onClick={()=>pending(s[iLang])}><span>{s[iLang]}</span><span aria-hidden="true">›</span></button>)}</div>
 </div>;
 return <main className={'site '+(motion?'motion':'still')} lang={lang.toLowerCase()}>
  <div className="desktop-art">
   <img className="reference" src={lang==='FR'?"/images/backdrop-clean.webp?v=20261103-lang-clean-2":`/images/backdrop-${lang.toLowerCase()}-v10.webp`} alt="Décor nocturne de la bibliothèque Milaghaiba"/>
   <div className="stars" aria-hidden="true"/>
   <nav className="nav-hotspots" aria-label="Navigation">
    <button style={pos([127,24,83,44])} onClick={()=>{setSelected(null);setHover(null);setPanelOpen(false);setNotice('')}} aria-label={t.home}/>
    <button style={pos([216,24,90,44])} onClick={()=>setMenu(!menu)} aria-label={t.themes} aria-expanded={menu}/>
    <button style={pos([326,24,132,44])} onClick={()=>input.current?.focus()} aria-label={t.go}/>
    <button style={pos([459,24,99,44])} onClick={()=>pending(t.sources)} aria-label={t.sources}/>
   </nav>
   {menu&&<div className="drop">{chapters.map((c,i)=><button key={i} onClick={()=>{choose(i);setMenu(false)}}>{c.title[iLang]}</button>)}</div>}
   <form className="desk-search" style={pos([354,313,750,58])} onSubmit={lookup}>
    <label className="sr-only" htmlFor="main-query">{t.search}</label>
    <input dir={lang==='AR'?'rtl':'ltr'} ref={input} id="main-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>
    <button type="submit">{t.go}</button>
   </form>
   <div className="hotspots-container" ref={cards}>{chapters.map((c,i)=>card(c,i))}</div>
   <div className="langs" role="group" aria-label="Langue" style={pos([1158,21,149,42])}>{['FR','AR','EN'].map(l=><button key={l} aria-pressed={lang===l} onClick={()=>{setLang(l);setNotice('');setHover(null)}}>{l}</button>)}</div>
   <aside className="details" style={{...pos([1017,394,380,540]),'--chapter-image':`url(/images/chapitre-${selectedIndex===null?5:selectedIndex+1}${lang==='FR'?'':('-'+lang.toLowerCase())}.webp)`}} aria-live="polite">{(hover!==null||panelOpen)?panel:<div className="panel-empty" aria-label={t.choose}><span aria-hidden="true">✧</span><p>{t.choose}</p></div>}</aside>
  </div>
  <div className="mobile-art">
   <nav className="mobile-top"><button onClick={()=>{setSelected(null);setPanelOpen(false);setNotice('')}}>{t.home}</button><button onClick={()=>document.querySelector('#chapitres-mobile')?.scrollIntoView({behavior:'smooth'})}>{t.themes}</button><button onClick={()=>pending(t.sources)}>{t.sources}</button><div>{['FR','AR','EN'].map(l=><button key={l} onClick={()=>setLang(l)} aria-pressed={lang===l}>{l}</button>)}</div></nav>
   <header className="mobile-hero"><h1>Milaghaiba</h1><p lang="ar" dir="rtl">الملة الغائبة</p><h2>{t.chapters}</h2></header>
   <form className="mobile-search" onSubmit={lookup}><input dir={lang==='AR'?'rtl':'ltr'} value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/><button>{t.go}</button></form>
   <div className="mobile-grid" id="chapitres-mobile">{chapters.map((c,i)=>card(c,i,true))}</div>
   {panelOpen&&<aside className="mobile-details">{panel}</aside>}
  </div>
  <footer className="controls"><button aria-pressed={motion} onClick={()=>setMotion(!motion)}>{lang==='AR'?(motion?'✦ الحركات مفعّلة':'✧ تقليل الحركة'):lang==='EN'?(motion?'✦ Animations on':'✧ Reduced motion'):(motion?'✦ Animations actives':'✧ Animations réduites')}</button><span>Milaghaiba · {t.home}</span></footer>
  {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Fermer">×</button></div>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
