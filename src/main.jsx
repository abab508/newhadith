import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const C = [
  {id:'belief', icon:'◈', names:['Croyance et foi','العقيدة والإيمان','Faith and belief'], topics:[['Foi et ses piliers','أركان الإيمان','Pillars of faith'],['Unicité (Tawhid)','التوحيد','Monotheism'],['Destin','القدر','Divine decree'],['Sincérité','الإخلاص','Sincerity']]},
  {id:'purity', icon:'◈', names:['Purification','الطهارة','Purification'], topics:[['Ablutions','الوضوء','Ablution'],['Bain rituel','الغسل','Ritual bath'],['Eau et pureté','الماء والطهارة','Water and purity'],['Tayammum','التيمم','Dry ablution']]},
  {id:'prayer', icon:'◈', names:['Prière','الصلاة','Prayer'], topics:[['Prières obligatoires','الصلوات المفروضة','Obligatory prayers'],['Prière en groupe','صلاة الجماعة','Congregational prayer'],['Invocations','الأدعية','Supplications']]},
  {id:'fasting', icon:'◈', names:['Jeûne et Ramadan','الصيام ورمضان','Fasting and Ramadan'], topics:[['Jeûne','الصيام','Fasting'],['Ramadan','رمضان','Ramadan'],['Rupture du jeûne','الإفطار','Breaking the fast'],['Nuit du destin','ليلة القدر','Night of Decree']]},
  {id:'family', icon:'◈', names:['Mariage et famille','الزواج والأسرة','Marriage and family'], topics:[['Mariage','الزواج','Marriage'],['Choix des conjoints','اختيار الزوجين','Choosing a spouse'],['Droits des époux','حقوق الزوجين','Spousal rights'],['Dot (mahr)','المهر','Mahr'],['Divorce','الطلاق','Divorce'],['Éducation des enfants','تربية الأطفال','Raising children']]},
  {id:'trade', icon:'◈', names:['Commerce et affaires','التجارة والمعاملات','Trade and business'], topics:[['Vente et contrats','البيع والعقود','Sales and contracts'],['Éthique commerciale','أخلاقيات التجارة','Business ethics'],['Dettes','الديون','Debts']]},
  {id:'conduct', icon:'◈', names:['Morale et comportement','الأخلاق والآداب','Morals and manners'], topics:[['Patience','الصبر','Patience'],['Bienveillance','الإحسان','Kindness'],['Respect','الاحترام','Respect']]},
  {id:'last-day', icon:'◈', names:['Signes de la fin des temps','أشراط الساعة','Signs of the Last Hour'], topics:[['Signes mineurs','العلامات الصغرى','Minor signs'],['Signes majeurs','العلامات الكبرى','Major signs'],['Épreuves','الفتن','Trials']]}
];
const translations = {
 FR:{nav:['Accueil','Thèmes','Recherche','Sources'],eyebrow:'BIBLIOTHÈQUE DE HADITHS',headline:'Les grands chapitres de l’islam',description:'Les hadiths sont organisés par grands thèmes et sous-thèmes, afin de faciliter la recherche, l’étude et la compréhension de l’enseignement prophétique.',search:'Rechercher un hadith, un thème, un mot-clé…',action:'Rechercher',chapter:'Grands chapitres',sub:'Sous-thèmes',intro:'Les enseignements relatifs à',choose:'Survolez un chapitre',unavailable:'Cette page sera réalisée ultérieurement.',notFound:'Aucun chapitre trouvé.',motion:'Animations'},
 AR:{nav:['الرئيسية','المواضيع','البحث','المصادر'],eyebrow:'مكتبة الأحاديث النبوية',headline:'أبواب الإسلام الكبرى',description:'الأحاديث مرتبة حسب المواضيع والأبواب الفرعية لتيسير البحث والدراسة وفهم الهدي النبوي.',search:'ابحث عن حديث أو موضوع أو كلمة…',action:'بحث',chapter:'الأبواب الرئيسية',sub:'الأبواب الفرعية',intro:'أحاديث تتعلق بـ',choose:'مرّر المؤشر فوق أحد الأبواب',unavailable:'ستُنشأ هذه الصفحة لاحقًا.',notFound:'لم يتم العثور على باب.',motion:'الحركات'},
 EN:{nav:['Home','Themes','Search','Sources'],eyebrow:'HADITH LIBRARY',headline:'The great chapters of Islam',description:'Hadiths are arranged by major themes and subthemes to help with searching, studying and understanding prophetic teachings.',search:'Search for a hadith, topic or keyword…',action:'Search',chapter:'Major chapters',sub:'Subtopics',intro:'Teachings relating to',choose:'Hover over a chapter',unavailable:'This page will be created later.',notFound:'No matching chapter.',motion:'Animations'}
};
const placements=[
 [81,482,268,197],[364,482,257,197],[636,482,254,197],[902,482,256,197],
 [81,693,268,197],[364,693,257,197],[636,693,254,197],[902,693,256,197]
];
const at=(x,y,w,h)=>({left:(100*x/1672)+'%',top:(100*y/941)+'%',width:(100*w/1672)+'%',height:(100*h/941)+'%'});
function App(){
 const [lang,setLang]=useState('FR'),[hover,setHover]=useState(null),[chosen,setChosen]=useState(null),[query,setQuery]=useState(''),[notice,setNotice]=useState(''),[motion,setMotion]=useState(true),[navOpen,setNavOpen]=useState(false);
 const idx=lang==='AR'?1:lang==='EN'?2:0;
 const tr=translations[lang];
 const active=hover??chosen;
 const chapter=active===null?null:C[active];
 useEffect(()=>{document.documentElement.lang=lang.toLowerCase();document.title='Milaghaiba — '+tr.chapter;},[lang,tr.chapter]);
 useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');setMotion(!m.matches);const fn=()=>setMotion(!m.matches);m.addEventListener('change',fn);return()=>m.removeEventListener('change',fn)},[]);
 function switchLang(next){setLang(next);setNotice('');setHover(null)}
 function select(i){setChosen(i);setNotice('')}
 function submit(e){e.preventDefault();const q=query.trim().toLocaleLowerCase();if(!q)return;const i=C.findIndex(c=>[...c.names,...c.topics.flat()].some(v=>v.toLocaleLowerCase().includes(q)));if(i===-1)setNotice(tr.notFound);else{select(i);setHover(null)}}
 function pending(label){setNotice(label+' — '+tr.unavailable)}
 const topicPanel=(visible)=> visible&&chapter ? <div className="panel-content" lang={lang.toLowerCase()} dir={lang==='AR'?'rtl':'ltr'}>
  <h3>{chapter.names[idx]}</h3><p className="panel-intro">{tr.intro} {chapter.names[idx].toLocaleLowerCase()}.</p><h4>✧ {tr.sub} ✧</h4>
  <div className="panel-topics">{chapter.topics.map((item,i)=><button key={i} onClick={()=>pending(item[idx])}><span>{item[idx]}</span><span aria-hidden="true">›</span></button>)}</div>
 </div>:null;
 return <main className={'page '+(motion?'with-motion':'without-motion')}>
  <div className="scene" role="region" aria-label="Milaghaiba">
   <img className="scene-art" src="/images/cinematic-textless.webp" alt="" aria-hidden="true" />
   <nav className="nav" style={at(143,28,505,48)} aria-label={tr.nav[0]}>{tr.nav.map((label,i)=><button key={i} onClick={()=>{if(i===0){setHover(null);setChosen(null);setNotice('')}else if(i===1)setNavOpen(v=>!v);else if(i===2)document.getElementById('search')?.focus();else pending(label)}}>{label}{i===1?' ⌄':''}</button>)}</nav>
   {navOpen&&<div className="nav-dropdown">{C.map((c,i)=><button key={c.id} onClick={()=>{select(i);setNavOpen(false)}}>{c.names[idx]}</button>)}</div>}
   <div className="langs" style={at(1353,24,202,47)} role="group" aria-label="Language">{['FR','AR','EN'].map((l,i)=><React.Fragment key={l}>{i>0&&<span className="sep" aria-hidden="true">|</span>}<button aria-pressed={lang===l} onClick={()=>switchLang(l)}>{l}</button></React.Fragment>)}</div>
   <header className="hero" style={at(445,57,764,243)} dir={lang==='AR'?'rtl':'ltr'}>
    <h1>Milaghaiba</h1><p className="arabic-brand" lang="ar" dir="rtl">الملة الغائبة</p>
    <p className="eyebrow">{tr.eyebrow}</p><h2>{tr.headline}</h2><p className="hero-description">{tr.description}</p>
   </header>
   <form className="search" style={at(425,315,798,66)} onSubmit={submit}><input id="search" value={query} onChange={e=>setQuery(e.target.value)} dir={lang==='AR'?'rtl':'ltr'} placeholder={tr.search} aria-label={tr.search}/><button>{tr.action}</button></form>
   <h2 className="chapter-heading" style={at(490,438,530,41)}>{tr.chapter}</h2>
   <div className="card-grid">{C.map((c,i)=><button type="button" key={c.id} className={'card-hotspot '+(hover===i?'hovered':'')} style={at(...placements[i])} aria-label={c.names[idx]} aria-pressed={chosen===i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} onClick={()=>select(i)}><span className="card-title" lang={lang.toLowerCase()} dir={lang==='AR'?'rtl':'ltr'}>{c.names[idx]}</span></button>)}</div>
   <aside className="panel" style={at(1172,405,457,497)} aria-live="polite">{topicPanel(active!==null)}</aside>
   {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Fermer">×</button></div>}
  </div>
  <div className="mobile-controls"><div className="mobile-langs">{['FR','AR','EN'].map(l=><button key={l} aria-pressed={lang===l} onClick={()=>switchLang(l)}>{l}</button>)}</div><h2>{tr.chapter}</h2><form onSubmit={submit}><input value={query} onChange={e=>setQuery(e.target.value)} dir={lang==='AR'?'rtl':'ltr'} placeholder={tr.search}/><button>{tr.action}</button></form><div className="mobile-chapters">{C.map((c,i)=><button key={c.id} onClick={()=>select(i)}>{c.names[idx]}</button>)}</div>{topicPanel(chosen!==null)}</div>
  <footer><button onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>✦ {tr.motion}</button></footer>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
