import React, { useEffect, useRef, useState } from 'react';
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
// Ambient original discret : aucune lecture automatique ni fichier externe.
function createWaterAmbience(){
 const AudioCtor=window.AudioContext||window.webkitAudioContext;
 if(!AudioCtor)return null;
 const context=new AudioCtor();
 const count=Math.floor(context.sampleRate*2);
 const buffer=context.createBuffer(1,count,context.sampleRate);
 const channel=buffer.getChannelData(0);
 for(let i=0;i<count;i++)channel[i]=Math.random()*2-1;
 const source=context.createBufferSource();
 source.buffer=buffer;source.loop=true;
 const lowpass=context.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=470;
 const highpass=context.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=130;
 const volume=context.createGain();volume.gain.value=0.0001;
 source.connect(lowpass).connect(highpass).connect(volume).connect(context.destination);
 source.start();
 volume.gain.setTargetAtTime(0.025,context.currentTime,0.5);
 return {context,source,volume};
}
/* Pictogrammes du modèle original : une icône vectorielle par chapitre. */
function ChapterIcon({id}){
 const common={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.65,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false","aria-hidden":true};
 const shapes={
  belief:<><path d="M3 20V10m18 10V10M3 20h18M6 20v-7l2-2 2 2v7m4 0v-7l2-2 2 2v7"/><path d="M5 10h14M6 10c0-4 3-6 6-7 3 1 6 3 6 7M12 3V1m-2 3h4"/></>,
  purity:<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/>,
  prayer:<><path d="M3 17h18l-2 4H5l-2-4ZM6 17l-2-9h16l-2 9Z"/><path d="M8 11h8M7 14h10"/></>,
  fasting:<><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v5m8-5v5M4 10h16m-8 4v4m-2-2h4"/></>,
  family:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  trade:<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5c0-2 2-3 4-3s4 1 4 3v2M3 13h18M10 12v3h4v-3"/></>,
  conduct:<><path d="M12 22V12m0 5c-4 0-8-3-8-8 5 0 8 3 8 8Zm0-5c0-5 3-9 8-9 0 5-3 9-8 9Z"/></>,
  "last-day":<><path d="M5 2h14M5 22h14M7 2c0 5 5 6 5 10 0 4-5 5-5 10m10-20c0 5-5 6-5 10 0 4 5 5 5 10"/><path d="M9 7h6m-6 10h6"/></>
 };
 return <svg {...common}>{shapes[id]||shapes.belief}</svg>;
}
function App(){
 const ambienceRef=useRef(null);
 const [sound,setSound]=useState(false);
 const [lang,setLang]=useState('FR'),[hover,setHover]=useState(null),[chosen,setChosen]=useState(null),[query,setQuery]=useState(''),[notice,setNotice]=useState(''),[motion,setMotion]=useState(true),[navOpen,setNavOpen]=useState(false);
 const idx=lang==='AR'?1:lang==='EN'?2:0;
 const tr=translations[lang];
 const active=hover??chosen;
 const chapter=active===null?null:C[active];
 useEffect(()=>{document.documentElement.lang=lang.toLowerCase();document.title='Milaghaiba — '+tr.chapter;},[lang,tr.chapter]);
 useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');setMotion(!m.matches);const fn=()=>setMotion(!m.matches);m.addEventListener('change',fn);return()=>m.removeEventListener('change',fn)},[]);
 useEffect(()=>()=>{const audio=ambienceRef.current;if(audio){audio.source.stop();void audio.context.close();ambienceRef.current=null}},[]);
 async function toggleSound(){
  if(sound){
   const audio=ambienceRef.current;ambienceRef.current=null;setSound(false);
   if(audio){audio.volume.gain.setTargetAtTime(0.0001,audio.context.currentTime,0.09);audio.source.stop(audio.context.currentTime+0.4);await audio.context.close().catch(()=>{})}
   return;
  }
  try{
   const audio=createWaterAmbience();
   if(!audio)return;
   ambienceRef.current=audio;
   await audio.context.resume();
   setSound(true);
  }catch{setNotice(lang==='AR'?'الصوت غير متاح':lang==='EN'?'Sound is unavailable':'Son indisponible')}
 }
 function switchLang(next){setLang(next);setNotice('');setHover(null)}
 function select(i){setChosen(i);setNotice('')}
 function submit(e){e.preventDefault();const q=query.trim().toLocaleLowerCase();if(!q)return;const i=C.findIndex(c=>[...c.names,...c.topics.flat()].some(v=>v.toLocaleLowerCase().includes(q)));if(i===-1)setNotice(tr.notFound);else{select(i);setHover(null)}}
 function pending(label){setNotice(label+' — '+tr.unavailable)}
 const topicPanel=(visible)=> visible&&chapter ? <div className="panel-content cinematic-panel-in" lang={lang.toLowerCase()} dir={lang==='AR'?'rtl':'ltr'}>
  <h3>{chapter.names[idx]}</h3><p className="panel-intro">{tr.intro} {chapter.names[idx].toLocaleLowerCase()}.</p><h4>✧ {tr.sub} ✧</h4>
  <div className="panel-topics">{chapter.topics.map((item,i)=><button key={i} onClick={()=>pending(item[idx])}><span>{item[idx]}</span><span aria-hidden="true">›</span></button>)}</div>
 </div>:null;
 return <main key={lang} className={'page '+(motion?'with-motion':'without-motion')} lang={lang.toLowerCase()}>
  <div className="scene" role="region" aria-label="Milaghaiba"><div className="cinema-particles" aria-hidden="true"/><div className="cinema-lantern-glow" aria-hidden="true"/><div className="cinema-cloud-haze" aria-hidden="true"/><div className="cinema-book-light" aria-hidden="true"/>
   <img className="scene-art" src="/images/cinematic-textless.webp" alt="" aria-hidden="true" />
   <nav className="nav" style={at(143,28,505,48)} aria-label={tr.nav[0]}>{tr.nav.map((label,i)=><button key={i} onClick={()=>{if(i===0){setHover(null);setChosen(null);setNotice('')}else if(i===1)setNavOpen(v=>!v);else if(i===2)document.getElementById('search')?.focus();else pending(label)}}>{label}{i===1?' ⌄':''}</button>)}</nav>
   {navOpen&&<div className="nav-dropdown">{C.map((c,i)=><button key={c.id} onClick={()=>{select(i);setNavOpen(false)}}>{c.names[idx]}</button>)}</div>}
   <div className="langs" style={at(1353,24,202,47)} role="group" aria-label="Language">{['FR','AR','EN'].map((l,i)=><React.Fragment key={l}>{i>0&&<span className="sep" aria-hidden="true">|</span>}<button aria-pressed={lang===l} onClick={()=>switchLang(l)}>{l}</button></React.Fragment>)}</div>
   <header className="hero cinematic-reveal" style={at(445,57,764,243)} dir={lang==='AR'?'rtl':'ltr'}>
    <h1 className={lang==='AR'?'brand-ar':'brand-latin'} lang={lang==='AR'?'ar':'fr'} dir={lang==='AR'?'rtl':'ltr'}>{lang==='AR'?'الملة الغائبة':'Milaghaiba'}</h1><p className="arabic-brand" lang="ar" dir="rtl" aria-hidden={lang==='AR'}>{lang==='AR'?'\u00a0':'الملة الغائبة'}</p>
    <p className="eyebrow">{tr.eyebrow}</p><h2>{tr.headline}</h2><p className="hero-description">{tr.description}</p>
   </header>
   <form className="search" style={at(425,315,798,66)} onSubmit={submit}><svg className="search-magnifier" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input id="search" value={query} onChange={e=>setQuery(e.target.value)} dir={lang==='AR'?'rtl':'ltr'} placeholder={tr.search} aria-label={tr.search}/><button>{tr.action}</button></form>
   <h2 className="chapter-heading cinematic-reveal" style={at(490,438,530,41)}>{tr.chapter}</h2>
   <div className="card-grid">{C.map((c,i)=><button type="button" key={c.id} className={'card-hotspot card-'+c.id+' '+(hover===i?'hovered':'')} style={at(...placements[i])} aria-label={c.names[idx]} aria-pressed={chosen===i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} onClick={()=>select(i)}><span className="card-labels" lang={lang.toLowerCase()} dir={lang==='AR'?'rtl':'ltr'}><span className="card-icon" aria-hidden="true"><ChapterIcon id={c.id}/></span><span className="card-title">{c.names[idx]}</span>{lang!=='AR'&&<span className="card-ar-subtitle" lang="ar" dir="rtl">{c.names[1]}</span>}</span></button>)}</div>
   <aside className="panel" style={at(1172,405,457,497)} aria-live="polite">{topicPanel(active!==null)}</aside>
   {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Fermer">×</button></div>}
  </div>
  <div className="mobile-controls"><div className="mobile-langs">{['FR','AR','EN'].map(l=><button key={l} aria-pressed={lang===l} onClick={()=>switchLang(l)}>{l}</button>)}</div><h2>{tr.chapter}</h2><form onSubmit={submit}><input value={query} onChange={e=>setQuery(e.target.value)} dir={lang==='AR'?'rtl':'ltr'} placeholder={tr.search}/><button>{tr.action}</button></form><div className="mobile-chapters">{C.map((c,i)=><button key={c.id} onClick={()=>select(i)}>{c.names[idx]}</button>)}</div>{topicPanel(chosen!==null)}</div>
  <footer className="cinema-toolbar"><button type="button" onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>✦ {tr.motion} {motion?'✓':'○'}</button><button type="button" onClick={()=>void toggleSound()} aria-pressed={sound}>{sound?'♫':'♪'} {lang==='AR'?(sound?'إيقاف الصوت':'صوت الماء'):lang==='EN'?(sound?'Mute ambience':'Water ambience'):(sound?'Couper l’ambiance':'Ambiance eau')}</button></footer>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
