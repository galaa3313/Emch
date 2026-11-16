/* ================= «СУРАХ» ХЭСЭГ: биологи, хими — анхан шатнаас ахисан шат хүртэл =================
   Ажиллах зарчим:
   1) Нүүр: түвшин (Анхан / Дунд / Ахисан) ба хичээл (Биологи / Хими) сонгоод хичээлийн жагсаалт харна.
   2) Хичээл: тайлбар → 3D (молекул, атом, эс, митохондри эсвэл атлас) → шалгалт.
   3) Шалгалтад 80%-иас дээш авбал дараагийн хичээл нээгдэнэ. Явц энэ төхөөрөмж дээр хадгалагдана.
   Атласын функцууд (startTour, setIso, enterEye ...) нь үндсэн скриптэд глобал байдлаар тодорхойлогдсон. */
(function(){
'use strict';
const L = window.LEARN || [];                                         // бүх хичээл (data-1/2/3.js-ээс)
const $ = id=>document.getElementById(id);                            // id-аар элемент авах
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); // HTML-ийг аюулгүй болгох
// Түвшний нэр — гадаадын жишгээр: IGCSE → AP/A-level (ЭЕШ) → MCAT (pre-med) → USMLE Step 1 (анагаахын суурь)
const LV = {1:['Анхан шат','6–9-р анги'],2:['Ахлах / ЭЕШ','10–12, AP · A-level'],3:['Анагаахад бэлтгэх','Pre-med · MCAT'],4:['Анагаахын суурь','USMLE Step 1 бүтэц']};
const SUB = {bio:'Биологи',chem:'Хими',phys:'Физик',histo:'Гистологи',path:'Эмгэг судлал',micro:'Микробиологи',pharm:'Фармакологи'};                 // хичээлүүд (физик нь 3-р түвшнээс)                             // хичээлийн нэр
const PASS = 0.8;                                                     // тэнцэх босго (80%)

/* ---------- Хадгалах / ачаалах (localStorage — алдаа гарвал чимээгүй алгасна) ---------- */
const store = {
 get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
const S = {                                                            // одоогийн төлөв
 lv: store.get('learn-lv',1),                                         // сонгосон түвшин
 sub: store.get('learn-sub','bio'),                                   // сонгосон хичээл
 prog: store.get('learn-prog',{}),                                     // {id:{best:0..1, done:true}}
 all: store.get('learn-all',false),                                    // бүх хичээлийг нээх эсэх
 cur: null,                                                            // нээлттэй хичээл
 view: 'home',                                                         // home | lesson | quiz | gloss
 quiz: null,                                                           // шалгалтын явц
 back: null                                                            // атлас руу шилжихэд буцах хичээл
};
const saveProg = ()=>store.set('learn-prog',S.prog);

/* ---------- DOM бүтэц үүсгэх ---------- */
const root = document.createElement('div');root.className='learn';root.id='learn';root.hidden=true;
root.setAttribute('role','dialog');root.setAttribute('aria-label','Сурах — биологи, хими');
root.innerHTML = `<div class="ln-top"><h2 id="lnTitle">Сурах</h2><span class="sp"></span>
  <button class="ln-btn" id="lnGloss">Нэр томьёо</button><button class="ln-btn" id="lnHome">Хичээлүүд</button><button class="ln-btn" id="lnClose">Атлас руу</button></div>
  <div class="ln-body" id="lnBody"></div>`;
document.body.appendChild(root);
const body = root.querySelector('#lnBody');
// Атлас дээр гарч ирэх «Хичээл рүү буцах» товч
const backBtn = document.createElement('button');backBtn.className='ln-btn pri ln-back';backBtn.hidden=true;backBtn.textContent='↩ Хичээл рүү буцах';
document.body.appendChild(backBtn);
backBtn.onclick = ()=>{backBtn.hidden=true;open(S.back);};

/* ---------- Тусламж: хичээлийн жагсаалт, түгжээ ---------- */
const listOf = (lv,sub)=>L.filter(l=>l.lv===lv&&l.sub===sub);       // тухайн түвшин, хичээлийн хичээлүүд
const done = id=>!!(S.prog[id]&&S.prog[id].done);                    // тэнцсэн эсэх
// Хичээл нээлттэй эсэх: эхнийх, эсвэл өмнөх нь тэнцсэн, эсвэл «бүгдийг нээх» асаалттай
function unlocked(l){if(S.all)return true;const arr=listOf(l.lv,l.sub),i=arr.indexOf(l);return i<=0||done(arr[i-1].id);}

/* ---------- 1. НҮҮР ХУУДАС ---------- */
function home(){S.view='home';S.cur=null;LV3&&LV3.stop();$('lnTitle').textContent='Сурах';
 // Тухайн түвшинд хичээлтэй байгаа хичээлүүдийг л таб болгон харуулна
 const subs=Object.keys(SUB).filter(k=>L.some(l=>l.lv===S.lv&&l.sub===k));if(subs.length&&!subs.includes(S.sub))S.sub=subs[0];
 const arr=listOf(S.lv,S.sub),dn=arr.filter(l=>done(l.id)).length;
 const tot=L.length,tdn=L.filter(l=>done(l.id)).length;
 body.innerHTML=`<div class="ln-wrap">
  <p class="ln-sum">Биологи, химийг алхам алхмаар — анхан шатнаас анагаахын суурь хүртэл. Хичээл бүр тайлбар, 3D загвар, шалгалттай. Шалгалтад 80%-иас дээш авбал дараагийн хичээл нээгдэнэ.</p>
  <div class="ln-meta"><span>Нийт явц</span><span>${tdn} / ${tot} хичээл</span></div>
  <div class="ln-prog"><i style="width:${tot?tdn/tot*100:0}%"></i></div>
  <div class="ln-seg lvl" role="group" aria-label="Түвшин">${[1,2,3,4].map(k=>`<button data-lv="${k}" aria-pressed="${S.lv===k}">${LV[k][0]}<small>${LV[k][1]}</small></button>`).join('')}</div>
  <div class="ln-seg subs${subs.length>3?' many':''}" role="group" aria-label="Хичээл">${(subs.length?subs:['bio','chem']).map(k=>`<button data-sub="${k}" aria-pressed="${S.sub===k}">${SUB[k]}</button>`).join('')}</div>
  <div class="ln-meta"><span>${LV[S.lv][0]} · ${SUB[S.sub]}</span><span>${dn} / ${arr.length}</span></div>
  ${arr.length?'':`<p class="ln-note" style="font-size:14px">Энэ хэсгийн хичээлүүд бэлтгэгдэж байна — удахгүй нэмэгдэнэ.</p>`}
  <div class="ln-list">${arr.map((l,i)=>{const ok=unlocked(l),d=done(l.id),p=S.prog[l.id];
    return `<button class="ln-card${d?' done':''}${ok?'':' lock'}" data-id="${l.id}" ${ok?'':'aria-disabled="true"'}>
     <span class="n">${d?'✓':ok?i+1:'🔒'}</span><span><b>${esc(l.t)}</b><span>${esc(l.sum)}</span></span>
     <em>${d?Math.round(p.best*100)+'%':p&&p.best!=null?Math.round(p.best*100)+'%':ok?'Эхлэх':'Түгжээтэй'}</em></button>`;}).join('')}</div>
  <label class="ln-check"><input type="checkbox" id="lnAll" ${S.all?'checked':''}> Бүх хичээлийг нээх (багш, эцэг эхэд)</label>
  <p class="ln-note">Агуулга нь Монголын ерөнхий боловсролын сургуулийн биологи, химийн хөтөлбөрийн сэдвүүд болон олон улсын нээлттэй сурах бичгүүдэд (OpenStax гэх мэт) тулгуурлан бичигдсэн. Энэ нь эмчийн зөвлөгөөг орлохгүй. 3D эс, митохондри, молекулын загваруудыг энэ апп-д зориулж кодоор бүтээсэн.</p></div>`;
 // Үйлдлүүд
 body.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{S.lv=+b.dataset.lv;store.set('learn-lv',S.lv);home();});
 body.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{S.sub=b.dataset.sub;store.set('learn-sub',S.sub);home();});
 body.querySelectorAll('.ln-card').forEach(b=>b.onclick=()=>{const l=L.find(x=>x.id===b.dataset.id);if(!unlocked(l)){b.querySelector('em').textContent='Өмнөхөө давна уу';return;}lesson(l);});
 $('lnAll').onchange=e=>{S.all=e.target.checked;store.set('learn-all',S.all);home();};
 body.scrollTop=0;}

/* ---------- 2. ХИЧЭЭЛ ---------- */
// k-р хэсгийн дараа харуулах схем зургууд (figs-*.js-ээс)
function figsAfter(id,k){const arr=((window.FIG||{})[id]||[]).filter(f=>f.after===k);
 return arr.map((f,i)=>`<figure class="ln-fig"><div class="ln-fig-sc">${f.svg}</div><figcaption>${esc(f.cap)}<button class="ln-btn ln-zoom" data-fig="${id}|${k}|${i}" aria-label="Томруулж харах">⤢ Томруулах</button></figcaption></figure>`).join('');}
// Үнэгүй, нээлттэй эх сурвалжийн жагсаалт
function srcList(id){const a=(window.SRC||{})[id];if(!a||!a.length)return '';
 return `<section class="ln-sec ln-src"><h3>Нэмэлт үнэгүй эх сурвалж</h3><ul>${a.map(([t,u,lc])=>`<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a> <small>${esc(lc)}</small></li>`).join('')}</ul><p class="ln-note">Интернэт шаардана. Ихэнх нь англи хэл дээр — багш, эцэг эхтэйгээ хамт үзээрэй.</p></section>`;}
// Зургийг бүтэн дэлгэцээр томруулж харах (утсан дээр жижиг бичгийг уншихад)
function zoomFig(svgHtml,cap){const z=document.createElement('div');z.className='ln-zoomv';z.innerHTML=`<div class="ln-zoomb">${svgHtml}</div><p>${esc(cap)}</p><button class="ln-btn pri">✕ Хаах</button>`;
 z.querySelector('button').onclick=()=>z.remove();z.onclick=e=>{if(e.target===z)z.remove();};root.appendChild(z);}
const VIEW_ACTS=['mol','atom','cell','mito'];                         // хичээл дотор нээгдэх 3D
function lesson(l){S.view='lesson';S.cur=l;$('lnTitle').textContent=LV[l.lv][0]+' · '+SUB[l.sub];
 const arr=listOf(l.lv,l.sub),i=arr.indexOf(l);
 body.innerHTML=`<div class="ln-wrap">
  <div class="ln-steps"><span class="on">1. Унших</span><span>2. 3D-ээр харах</span><span>3. Шалгалт</span></div>
  <h1 class="ln-h">${i+1}. ${esc(l.t)}</h1><p class="ln-sum">${esc(l.sum)}</p>
  ${l.sec.map(([h,t],k)=>`<section class="ln-sec"><h3>${h}</h3><div>${t}</div></section>`+figsAfter(l.id,k)).join('')}
  ${l.act.length?`<div><div class="ln-meta" style="margin-bottom:6px"><span>3D-ээр харах</span></div><div class="ln-acts">${l.act.map((a,k)=>`<button class="ln-act${VIEW_ACTS.includes(a.a)?'':' atlas'}" data-a="${k}">${esc(a.l)}${VIEW_ACTS.includes(a.a)?'':' → атлас'}</button>`).join('')}</div></div>`:''}
  <div class="lv" id="lnView" hidden><div id="lnStage" style="position:absolute;inset:0"></div><div class="lv-title" id="lnVT"></div><button class="ln-btn lv-close" id="lnVX" aria-label="3D хаах">✕</button></div>
  ${(window.FACT||{})[l.id]?`<aside class="ln-fact"><b>Сонирхолтой баримт</b>${esc(FACT[l.id])}</aside>`:''}
  <section class="ln-sec"><h3>Түлхүүр үгс</h3><div class="ln-terms">${l.terms.map(([a,b])=>`<div><b>${esc(a)}</b>${esc(b)}</div>`).join('')}</div></section>
  ${srcList(l.id)}
  <div class="ln-nav"><button class="ln-btn" id="lnPrev" ${i>0?'':'disabled'}>← Өмнөх</button><button class="ln-btn pri" id="lnQuiz">Шалгалт өгөх (${l.q.length} асуулт)</button></div></div>`;
 body.scrollTop=0;
 // 3D товчнууд
 body.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=l.act[+b.dataset.a];
  if(VIEW_ACTS.includes(a.a)){body.querySelectorAll('[data-a]').forEach(x=>x.setAttribute('aria-pressed',x===b));show3d(a);}
  else toAtlas(a);});
 // Зураг томруулах товч
 body.querySelectorAll('.ln-zoom').forEach(b=>b.onclick=()=>{const [id,k,i]=b.dataset.fig.split('|');const f=FIG[id].filter(x=>x.after===+k)[+i];zoomFig(f.svg,f.cap);});
 $('lnVX').onclick=()=>{LV3.stop();$('lnView').hidden=true;body.querySelectorAll('[data-a]').forEach(x=>x.setAttribute('aria-pressed','false'));};
 $('lnPrev').onclick=()=>i>0&&lesson(arr[i-1]);
 $('lnQuiz').onclick=()=>quiz(l);
 // Эхний 3D (молекул, эс г.м.) байвал автоматаар харуулахгүй — хүүхэд өөрөө дарж үзнэ
}
// Хичээл доторх 3D үзэгчийг нээх
function show3d(a){const v=$('lnView');v.hidden=false;
 requestAnimationFrame(()=>{const t=LV3.show($('lnStage'),a);$('lnVT').textContent=t;LV3.resize();});
 v.scrollIntoView({behavior:'smooth',block:'nearest'});}

/* ---------- 3. АТЛАС РУУ ШИЛЖИХ ---------- */
// Атлас бүрэн ачаалагдсаныг хүлээх (ATLAS.ready болтол)
function atlasReady(){return new Promise(res=>{const ok=()=>window.ATLAS&&ATLAS.ready;
 if(ok())return res();const iv=setInterval(()=>{if(ok()){clearInterval(iv);res();}},300);});}
async function toAtlas(a){S.back=S.cur;close();backBtn.hidden=false;
 await atlasReady();
 try{ATLAS.reset();}catch(e){}                                          // өмнө ажиллаж байсан горимуудыг зогсоох
 try{const f=ATLAS[a.a];if(f)await f(a.k);}catch(e){console.warn('atlas',e);} // sys, tour, guide, eye, preg, browse
}

/* ---------- 4. ШАЛГАЛТ ---------- */
// Хариултын дарааллыг холих (зөв хариулт үргэлж нэг байрлалд байхгүйн тулд)
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function quiz(l){S.view='quiz';LV3.stop();
 S.quiz={l,i:0,ok:0,qs:shuffle(l.q).map(q=>({q:q[0],opts:shuffle(q[1].map((t,k)=>({t,ok:k===q[2]}))),exp:q[3]}))};
 qShow();}
function qShow(){const Q=S.quiz,q=Q.qs[Q.i];
 body.innerHTML=`<div class="ln-wrap">
  <div class="ln-steps"><span>1. Унших</span><span>2. 3D-ээр харах</span><span class="on">3. Шалгалт</span></div>
  <h1 class="ln-h">${esc(Q.l.t)}</h1>
  <div class="ln-prog"><i style="width:${Q.i/Q.qs.length*100}%"></i></div>
  <div class="ln-quiz"><div class="ln-qn">Асуулт ${Q.i+1} / ${Q.qs.length}</div><div class="ln-q">${esc(q.q)}</div>
   ${q.opts.map((o,k)=>`<button class="ln-opt" data-k="${k}">${esc(o.t)}</button>`).join('')}
   <div id="lnExp"></div></div>
  <div class="ln-nav"><button class="ln-btn" id="lnBackL">← Хичээл рүү</button><button class="ln-btn pri" id="lnNext" hidden>${Q.i+1<Q.qs.length?'Дараагийн асуулт →':'Дүнг харах'}</button></div></div>`;
 body.scrollTop=0;
 body.querySelectorAll('.ln-opt').forEach(b=>b.onclick=()=>{const o=q.opts[+b.dataset.k];
  body.querySelectorAll('.ln-opt').forEach((x,k)=>{x.disabled=true;if(q.opts[k].ok)x.classList.add('ok');});   // зөв хариултыг ногооноор
  if(!o.ok)b.classList.add('no');else Q.ok++;                                                                   // буруу бол улаанаар
  $('lnExp').innerHTML=`<div class="ln-exp"><b>${o.ok?'Зөв!':'Буруу.'}</b> ${esc(q.exp)}</div>`;
  $('lnNext').hidden=false;$('lnNext').focus();});
 $('lnBackL').onclick=()=>lesson(Q.l);
 $('lnNext').onclick=()=>{Q.i++;Q.i<Q.qs.length?qShow():qEnd();};}
// Шалгалтын дүн, явц хадгалах
function qEnd(){const Q=S.quiz,l=Q.l,sc=Q.ok/Q.qs.length,pass=sc>=PASS;
 const p=S.prog[l.id]||{best:0,done:false};p.best=Math.max(p.best||0,sc);p.done=p.done||pass;p.ts=Date.now();S.prog[l.id]=p;saveProg();
 const arr=listOf(l.lv,l.sub),i=arr.indexOf(l),nx=arr[i+1];
 // Энэ түвшний сүүлийн хичээл бол дараагийн хичээл/түвшин рүү чиглүүлэх
 const nextLv=!nx&&l.lv<4?listOf(l.lv+1,l.sub)[0]:null;      // дараагийн түвшинд хичээл байвал
 body.innerHTML=`<div class="ln-wrap"><div class="ln-quiz ln-res">
  <div class="ln-qn">${esc(l.t)}</div><b>${Q.ok} / ${Q.qs.length}</b>
  <div>${pass?'Тэнцлээ! Дараагийн хичээл нээгдлээ.':'Дахин уншаад оролдоорой — 80%-иас дээш авбал тэнцэнэ.'}</div>
  <div class="ln-nav" style="justify-content:center">
   ${pass&&nx?`<button class="ln-btn pri" id="lnNx">Дараагийн хичээл: ${esc(nx.t)} →</button>`:''}
   ${pass&&nextLv?`<button class="ln-btn pri" id="lnNL">${LV[l.lv+1][0]} руу шилжих →</button>`:''}
   <button class="ln-btn" id="lnAgain">Дахин өгөх</button><button class="ln-btn" id="lnRe">Хичээлийг дахин унших</button><button class="ln-btn" id="lnH">Бүх хичээл</button></div></div></div>`;
 if($('lnNx'))$('lnNx').onclick=()=>lesson(nx);
 if($('lnNL'))$('lnNL').onclick=()=>{S.lv=l.lv+1;store.set('learn-lv',S.lv);lesson(nextLv);};
 $('lnAgain').onclick=()=>quiz(l);$('lnRe').onclick=()=>lesson(l);$('lnH').onclick=home;}

/* ---------- 5. НЭР ТОМЬЁОНЫ ТОЛЬ ---------- */
function gloss(){S.view='gloss';LV3.stop();$('lnTitle').textContent='Нэр томьёо';
 const all=[];L.forEach(l=>l.terms.forEach(([a,b])=>all.push({a,b,l})));all.sort((x,y)=>x.a.localeCompare(y.a,'mn'));
 body.innerHTML=`<div class="ln-wrap"><input class="ln-search" id="lnGs" type="search" placeholder="Хайх: жишээ нь «эс», «фермент»" aria-label="Нэр томьёо хайх"><div class="ln-gl" id="lnGl"></div></div>`;
 const draw=q=>{q=q.trim().toLowerCase();$('lnGl').innerHTML=all.filter(x=>!q||x.a.toLowerCase().includes(q)||x.b.toLowerCase().includes(q)).map(x=>`<div><b>${esc(x.a)}</b> — ${esc(x.b)}<small>${LV[x.l.lv][0]} · ${SUB[x.l.sub]} · ${esc(x.l.t)}</small></div>`).join('')||'<div>Олдсонгүй</div>';};
 draw('');$('lnGs').oninput=e=>draw(e.target.value);body.scrollTop=0;}

/* ---------- Нээх / хаах ---------- */
function open(l){root.hidden=false;backBtn.hidden=true;document.documentElement.style.overflow='hidden';
 const tab=$('tabLearn');if(tab)tab.setAttribute('aria-pressed','true');
 l?lesson(l):home();}
function close(){root.hidden=true;LV3&&LV3.stop();const tab=$('tabLearn');if(tab)tab.setAttribute('aria-pressed','false');}
$('lnClose').onclick=()=>{S.back=S.cur;close();if(S.back)backBtn.hidden=false;};
$('lnHome').onclick=home;$('lnGloss').onclick=gloss;
// Esc товчоор хаах (3D нээлттэй бол эхлээд 3D-г хаана)
addEventListener('keydown',e=>{if(root.hidden||e.key!=='Escape')return;const v=$('lnView');if(v&&!v.hidden){$('lnVX').click();return;}$('lnClose').click();});
window.LEARN_UI={open,close};                                          // атласаас дуудах
})();
