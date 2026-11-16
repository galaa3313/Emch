/* ================= СУРАХ ХЭСГИЙН 3D ҮЗЭГЧ =================
   Хичээл дотор гарч ирэх жижиг 3D цонх: молекул, атом (Борын загвар), амьтны эс, митохондри.
   Бүх загварыг энэ кодоор (процедурын аргаар) үүсгэдэг тул гадны лицензээс хамаарахгүй — зохиогчийн эрх нь таных. */
(function(){
'use strict';                                                     // алдааг эрт илрүүлэх хатуу горим
const T = THREE;                                                  // three.js-ийг богино нэрээр
const MOLS = {"h2o":{"n":"Ус H₂O","a":[["O",0,0,0],["H",0.757,0.586,0],["H",-0.757,0.586,0]],"b":[[0,1,1],[0,2,1]]},"o2":{"n":"Хүчилтөрөгч O₂","a":[["O",-0.605,0,0],["O",0.605,0,0]],"b":[[0,1,2]]},"co2":{"n":"Нүүрсхүчлийн хий CO₂","a":[["C",0,0,0],["O",1.16,0,0],["O",-1.16,0,0]],"b":[[0,1,2],[0,2,2]]},"ch4":{"n":"Метан CH₄","a":[["C",0,0,0],["H",0.629,0.629,0.629],["H",-0.629,-0.629,0.629],["H",-0.629,0.629,-0.629],["H",0.629,-0.629,-0.629]],"b":[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},"nh3":{"n":"Аммиак NH₃","a":[["N",0,0.1878836625913034,0],["H",0.937,-0.188,0.0],["H",-0.469,-0.188,0.812],["H",-0.469,-0.188,-0.812]],"b":[[0,1,1],[0,2,1],[0,3,1]]},"ethanol":{"n":"Этанол C₂H₅OH","a":[["C",0.0,0.0,0.0],["C",1.52,0.0,0.0],["O",1.997,1.348,0.0],["H",2.957,1.348,0.0],["H",-0.364,0.514,-0.89],["H",-0.364,-1.027,-0.0],["H",-0.364,0.514,0.89],["H",1.884,-0.514,0.89],["H",1.884,-0.514,-0.89]],"b":[[0,1,1],[1,2,1],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[1,8,1]]},"glycine":{"n":"Глицин (амин хүчил)","a":[["N",0.0,0.0,0.0],["C",1.47,0.0,0.0],["C",1.99,1.428,0.0],["O",1.319,2.374,0.347],["O",3.259,1.501,-0.425],["H",3.514,2.436,-0.396],["H",1.834,-0.514,0.89],["H",1.834,-0.514,-0.89],["H",-0.337,0.476,-0.825],["H",-0.337,-0.952,-0.0]],"b":[[0,1,1],[1,2,1],[2,3,2],[2,4,1],[4,5,1],[1,6,1],[1,7,1],[0,8,1],[0,9,1]]},"benzene":{"n":"Бензол C₆H₆","a":[["C",1.39,0.0,0],["C",0.695,1.204,0],["C",-0.695,1.204,0],["C",-1.39,0.0,0],["C",-0.695,-1.204,0],["C",0.695,-1.204,0],["H",2.48,0.0,0],["H",1.24,2.148,0],["H",-1.24,2.148,0],["H",-2.48,0.0,0],["H",-1.24,-2.148,0],["H",1.24,-2.148,0]],"b":[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[1,7,1],[2,8,1],[3,9,1],[4,10,1],[5,11,1]]},"nacl":{"n":"Хоолны давс NaCl (талст тор)","a":[["Na",-2.82,-2.82,-2.82],["Cl",-2.82,-2.82,0.0],["Na",-2.82,-2.82,2.82],["Cl",-2.82,0.0,-2.82],["Na",-2.82,0.0,0.0],["Cl",-2.82,0.0,2.82],["Na",-2.82,2.82,-2.82],["Cl",-2.82,2.82,0.0],["Na",-2.82,2.82,2.82],["Cl",0.0,-2.82,-2.82],["Na",0.0,-2.82,0.0],["Cl",0.0,-2.82,2.82],["Na",0.0,0.0,-2.82],["Cl",0.0,0.0,0.0],["Na",0.0,0.0,2.82],["Cl",0.0,2.82,-2.82],["Na",0.0,2.82,0.0],["Cl",0.0,2.82,2.82],["Na",2.82,-2.82,-2.82],["Cl",2.82,-2.82,0.0],["Na",2.82,-2.82,2.82],["Cl",2.82,0.0,-2.82],["Na",2.82,0.0,0.0],["Cl",2.82,0.0,2.82],["Na",2.82,2.82,-2.82],["Cl",2.82,2.82,0.0],["Na",2.82,2.82,2.82]],"b":[[0,9,0],[0,3,0],[0,1,0],[1,10,0],[1,4,0],[1,2,0],[2,11,0],[2,5,0],[3,12,0],[3,6,0],[3,4,0],[4,13,0],[4,7,0],[4,5,0],[5,14,0],[5,8,0],[6,15,0],[6,7,0],[7,16,0],[7,8,0],[8,17,0],[9,18,0],[9,12,0],[9,10,0],[10,19,0],[10,13,0],[10,11,0],[11,20,0],[11,14,0],[12,21,0],[12,15,0],[12,13,0],[13,22,0],[13,16,0],[13,14,0],[14,23,0],[14,17,0],[15,24,0],[15,16,0],[16,25,0],[16,17,0],[17,26,0],[18,21,0],[18,19,0],[19,22,0],[19,20,0],[20,23,0],[21,24,0],[21,22,0],[22,25,0],[22,23,0],[23,26,0],[24,25,0],[25,26,0]]}};                                          // молекулын координат (Å) — build үед орж ирнэ

/* ---------- Ерөнхий тусламж функцууд ---------- */
const v3 = (x,y,z)=>new T.Vector3(x,y,z);                          // вектор үүсгэх
const rnd = (a,b)=>a+Math.random()*(b-a);                         // [a,b) санамсаргүй тоо
let seed = 7;                                                     // давтагдах санамсаргүй тоо (загвар бүр ижил харагдахын тулд)
const srnd = (a,b)=>{seed=(seed*16807)%2147483647;return a+(seed/2147483647)*(b-a);};
// Органик (амьд мэт) гадаргуу гаргах энгийн «долгион» шуугиан
const wob = (x,y,z,f)=>Math.sin(x*f+1.3)*Math.sin(y*f*1.7+0.4)*Math.sin(z*f*1.3+2.1);
// Геометрийн оройнуудыг хэвийн чиглэлд нь бага зэрэг түлхэж органик хэлбэр өгөх
function bumpy(geo,amp,freq){
 const p=geo.attributes.position,n=v3(0,0,0);geo.computeVertexNormals();const nm=geo.attributes.normal;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);n.set(nm.getX(i),nm.getY(i),nm.getZ(i));
  const d=amp*(wob(x,y,z,freq)+0.5*wob(x,y,z,freq*2.3));p.setXYZ(i,x+n.x*d,y+n.y*d,z+n.z*d);}
 geo.computeVertexNormals();return geo;}
// Материал үүсгэх товчлол: өнгө, гөлгөр байдал, тунгалаг байдал
function mat(c,o={}){return new T.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.55,metalness:0,clearcoat:0.25,clearcoatRoughness:0.5,side:T.DoubleSide},o));}

/* ---------- Үзэгчийн төлөв ---------- */
const VW={el:null,cv:null,r:null,scene:null,cam:null,ctl:null,root:null,parts:[],raf:0,info:null,chips:null,t0:0,anim:[],kind:null,exp:0,expT:0};

// Үзэгчийг өгөгдсөн DOM хайрцагт байрлуулах (анх удаа renderer үүсгэнэ)
function mount(box){
 if(!VW.r){                                                        // нэг л renderer үүсгэж дахин ашиглана
  VW.r=new T.WebGLRenderer({antialias:true,alpha:true});
  VW.r.setPixelRatio(Math.min(devicePixelRatio||1,2));             // утсан дээр хэт ачаалахгүй
  VW.r.outputEncoding=T.sRGBEncoding;VW.r.toneMapping=T.ACESFilmicToneMapping;VW.r.toneMappingExposure=1.1;
  VW.r.localClippingEnabled=true;                                   // эрхтэнцрийг огтолж харуулахад хэрэгтэй
  VW.cv=VW.r.domElement;VW.cv.className='lv-cv';
  VW.scene=new T.Scene();
  VW.cam=new T.PerspectiveCamera(40,1,0.01,200);
  // Гэрэлтүүлэг: тэнгэр/газрын зөөлөн гэрэл + чиглэлтэй хоёр гэрэл
  VW.scene.add(new T.HemisphereLight(0xfff6ee,0x2a2f3a,0.9));
  const d1=new T.DirectionalLight(0xffffff,1.6);d1.position.set(3,4,5);VW.scene.add(d1);
  const d2=new T.DirectionalLight(0x9fc4ff,0.6);d2.position.set(-4,-2,-3);VW.scene.add(d2);
  VW.ctl=new T.OrbitControls(VW.cam,VW.cv);VW.ctl.enableDamping=true;VW.ctl.dampingFactor=0.08;
  // Хуруугаар дарж эрхтэнцэр сонгох (чирэхгүй дарсан үед)
  let down=null;
  VW.cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY,performance.now()];});
  VW.cv.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down[0],dy=e.clientY-down[1];
   if(dx*dx+dy*dy<64&&performance.now()-down[2]<600)pick(e);down=null;});
 }
 box.innerHTML='';box.appendChild(VW.cv);VW.el=box;
 // Доод талын мэдээлэл ба эрхтэнцрийн товчнууд
 VW.info=document.createElement('div');VW.info.className='lv-info';box.appendChild(VW.info);
 const bar=document.createElement('div');bar.className='lv-bar';box.appendChild(bar);VW.chips=bar;
 resize();
 if(!VW.raf)loop();                                                 // зурах давталтыг эхлүүлэх
}
// Хайрцгийн хэмжээнд тааруулах
function resize(){if(!VW.el)return;const w=VW.el.clientWidth||300,h=VW.el.clientHeight||300;VW.r.setSize(w,h,false);VW.cam.aspect=w/h;VW.cam.updateProjectionMatrix();}
addEventListener('resize',resize);
// Өмнөх загварыг цэвэрлэх (санах ой чөлөөлөх)
function clear(){if(VW.root){VW.scene.remove(VW.root);VW.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){[].concat(o.material).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});}
 VW.root=new T.Group();VW.scene.add(VW.root);VW.parts=[];VW.anim=[];VW.exp=0;VW.expT=0;}
// Үзэгчийг зогсоох (хичээлээс гарахад)
function stop(){cancelAnimationFrame(VW.raf);VW.raf=0;if(VW.el&&VW.cv.parentNode===VW.el)VW.el.removeChild(VW.cv);VW.el=null;}
// Зурах давталт
function loop(){VW.raf=requestAnimationFrame(loop);if(!VW.el||!VW.el.isConnected){stop();return;}
 const t=(performance.now()-VW.t0)/1000;VW.anim.forEach(f=>f(t));     // хөдөлгөөнт хэсгүүд (электрон гэх мэт)
 VW.exp+=(VW.expT-VW.exp)*0.12;                                       // задлалтын зөөлөн шилжилт
 VW.parts.forEach(p=>{if(p.dir)p.obj.position.copy(p.home).addScaledVector(p.dir,VW.exp);});
 VW.ctl.update();VW.r.render(VW.scene,VW.cam);}
// Камерыг загварт тааруулах
function frame(rad,dir){const d=dir||v3(0.6,0.35,1).normalize();VW.ctl.target.set(0,0,0);
 // Босоо (утасны) дэлгэц дээр хөндлөн харагдах өнцөг нарийн тул камерыг холдуулна
 const k=1.1/(Math.tan(T.MathUtils.degToRad(VW.cam.fov/2))*Math.min(1,VW.cam.aspect));VW.cam.position.copy(d.multiplyScalar(rad*k));VW.cam.near=rad*0.01;VW.cam.far=rad*40;VW.cam.updateProjectionMatrix();VW.ctl.minDistance=rad*0.4;VW.ctl.maxDistance=rad*8;VW.ctl.update();}

/* ---------- Эрхтэнцэр сонгох, тайлбар харуулах ---------- */
// part = {key, name, desc, objs:[], home, dir}
function addPart(key,name,desc,objs,dir){const p={key,name,desc,objs:[].concat(objs),obj:null,dir:dir||null,home:null};
 const g=new T.Group();p.objs.forEach(o=>g.add(o));VW.root.add(g);p.obj=g;p.home=g.position.clone();
 g.traverse(o=>{o.userData.part=p;});VW.parts.push(p);return p;}
// Хэсгийг тодруулах эсвэл тодруулгыг арилгах
function hl(p,on){p.obj.traverse(o=>{if(o.material&&o.material.emissive){o.material.emissive.setHex(on?0x553311:0x000000);}});}
let selP=null;
function select(p){if(selP)hl(selP,false);selP=p;if(p)hl(p,true);
 VW.info.innerHTML=p?`<b>${p.name}</b><span>${p.desc}</span>`:'<span>Хэсэг дээр дарж нэр, үүргийг нь харна уу.</span>';
 VW.chips.querySelectorAll('button[data-k]').forEach(b=>b.setAttribute('aria-pressed',!!p&&b.dataset.k===p.key));}
// Дарсан цэг дээрх хэсгийг олох
const rc=new T.Raycaster(),nd=new T.Vector2();
function pick(e){const r=VW.cv.getBoundingClientRect();nd.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(nd,VW.cam);
 const h=rc.intersectObjects(VW.root.children,true).find(x=>x.object.visible&&x.object.userData.part&&x.object.material.opacity!==0);
 select(h?h.object.userData.part:null);}
// Хэсгүүдийн товч ба «Задлах» товчийг зурах
function chipsFor(canExplode){const c=VW.chips;c.innerHTML='';
 if(canExplode){const b=document.createElement('button');b.className='lv-x';b.textContent='Задлах';b.setAttribute('aria-pressed','false');
  b.onclick=()=>{VW.expT=VW.expT?0:1;b.setAttribute('aria-pressed',!!VW.expT);};c.appendChild(b);}
 VW.parts.forEach(p=>{const b=document.createElement('button');b.dataset.k=p.key;b.textContent=p.name;b.onclick=()=>select(selP===p?null:p);c.appendChild(b);});
 select(null);}

/* ================= 1. МОЛЕКУЛ ================= */
// CPK өнгө ба харагдах радиус (Å)
const EL={H:[0xf4f4f4,0.31,'Устөрөгч'],C:[0x3a3f45,0.45,'Нүүрстөрөгч'],N:[0x3b6cf0,0.44,'Азот'],O:[0xe8382f,0.43,'Хүчилтөрөгч'],Na:[0x9b5cf0,0.55,'Натри (Na⁺)'],Cl:[0x2fd16a,0.62,'Хлор (Cl⁻)'],P:[0xff8c1a,0.5,'Фосфор'],S:[0xf2d12e,0.5,'Хүхэр']};
function showMol(key){clear();const M=MOLS[key];if(!M)return;VW.kind='mol';
 const sph=new T.SphereGeometry(1,32,22),cyl=new T.CylinderGeometry(1,1,1,16);
 const byEl={};                                                       // элемент бүрийг нэг «хэсэг» болгож бүлэглэх
 const P=M.a.map(a=>v3(a[1],a[2],a[3]));
 const c=P.reduce((s,p)=>s.add(p),v3(0,0,0)).multiplyScalar(1/P.length);P.forEach(p=>p.sub(c)); // төвд нь байрлуулах
 const ion=key==='nacl';                                               // ионы талст бол бөмбөлгийг томруулна
 M.a.forEach((a,i)=>{const e=EL[a[0]];const m=new T.Mesh(sph,mat(e[0],{roughness:0.35,clearcoat:0.6,side:T.FrontSide}));
  m.position.copy(P[i]);m.scale.setScalar(ion?e[1]*1.25:e[1]);(byEl[a[0]]=byEl[a[0]]||[]).push(m);});
 // Холбоос: ганц холбоо — нэг цилиндр, давхар — хоёр, ионы талст — нимгэн шугам
 const bonds=[];const bm=mat(0xb9c0c8,{roughness:0.4,side:T.FrontSide});
 M.b.forEach(([i,j,o])=>{const A=P[i],B=P[j],mid=A.clone().add(B).multiplyScalar(0.5),dir=B.clone().sub(A),len=dir.length();
  const q=new T.Quaternion().setFromUnitVectors(v3(0,1,0),dir.clone().normalize());
  const off=v3(0,0,1).cross(dir).normalize();if(off.lengthSq()<0.01)off.set(0,1,0);   // давхар холбооны шилжилтийн чиглэл
  const n=o===0?1:o,rad=o===0?0.035:0.085;
  for(let k=0;k<n;k++){const m=new T.Mesh(cyl,bm);m.quaternion.copy(q);m.scale.set(rad,len,rad);
   m.position.copy(mid).addScaledVector(off,n>1?(k-(n-1)/2)*0.22:0);bonds.push(m);}});
 Object.keys(byEl).forEach(k=>addPart(k,EL[k][2].includes('(')?EL[k][2]:EL[k][2]+' ('+k+')',k==='Na'?'Электроноо Cl-д өгч эерэг ион болсон.':k==='Cl'?'Электрон авч сөрөг ион болсон.':'Атом — өнгө нь олон улсын CPK тэмдэглэгээ.',byEl[k]));
 addPart('bond','Химийн холбоо',ion?'Na⁺ ба Cl⁻ ионууд эсрэг цэнэгээрээ татагдаж талст тор үүсгэнэ (ионы холбоо).':'Атомууд электрон хос хуваалцана (ковалент). Хоёр зэрэгцээ саваа — давхар холбоо.',bonds);
 const R=Math.max(1.2,...P.map(p=>p.length()))+0.6;frame(R);chipsFor(false);
 VW.anim.push(t=>{VW.root.rotation.y=t*0.25;});                        // аажмаар эргэх
 return M.n;}

/* ================= 2. АТОМ (Борын загвар) ================= */
const ZN=['','Устөрөгч H','Гели He','Лити Li','Берилли Be','Бор B','Нүүрстөрөгч C','Азот N','Хүчилтөрөгч O','Фтор F','Неон Ne','Натри Na','Магни Mg','Хөнгөн цагаан Al','Цахиур Si','Фосфор P','Хүхэр S','Хлор Cl','Аргон Ar','Кали K','Кальци Ca'];
const NEU=[0,0,2,4,5,6,6,7,8,10,10,12,12,14,14,16,16,18,22,20,20];    // хамгийн түгээмэл изотопын нейтроны тоо
function showAtom(Z){clear();VW.kind='atom';Z=Math.max(1,Math.min(20,Z|0));
 // Электроны давхарга: 2, 8, 8, 2 гэх мэт
 const sh=[];let left=Z;[2,8,8,2].forEach(c=>{if(left>0){sh.push(Math.min(c,left));left-=c;}});
 // Цөм: протон (улаан) ба нейтрон (саарал) бөмбөлгүүдийг нягт багцлах
 const sph=new T.SphereGeometry(1,20,14),np=[],nn=[];const N=Z+NEU[Z],r0=0.11;
 for(let i=0;i<N;i++){const k=i+0.5,phi=Math.acos(1-2*k/N),th=Math.PI*(1+Math.sqrt(5))*k,rr=r0*Math.cbrt(N)*0.62*Math.cbrt(k/N);
  const isP=Math.floor((i+1)*Z/N)>Math.floor(i*Z/N);                 // протоныг жигд тараах: нийт яг Z ширхэг гарна
  const m=new T.Mesh(sph,mat(isP?0xe2483d:0x9aa3ad,{roughness:0.4,side:T.FrontSide}));
  m.scale.setScalar(r0);m.position.set(rr*Math.sin(phi)*Math.cos(th),rr*Math.sin(phi)*Math.sin(th),rr*Math.cos(phi));
  (isP?np:nn).push(m);}
 addPart('p','Протон ('+Z+')','Цөм дэх эерэг цэнэгтэй бөөм. Тоо нь атомын дугаар (Z) — элементийг тодорхойлно.',np);
 if(nn.length)addPart('n','Нейтрон ('+nn.length+')','Цөм дэх цэнэггүй бөөм. Масс тоо = протон + нейтрон = '+N+'.',nn);
 // Давхарга бүрийн тойрог ба тойрог дээр эргэлдэх электронууд
 const rings=[],els=[];
 sh.forEach((cnt,s)=>{const R=0.55+s*0.45;const tilt=new T.Group();tilt.rotation.set(0.35*s+0.2,0.5*s,0);
  const ring=new T.Mesh(new T.TorusGeometry(R,0.008,8,96),new T.MeshBasicMaterial({color:0x7fa6c9,transparent:true,opacity:0.55}));tilt.add(ring);rings.push(tilt);
  for(let i=0;i<cnt;i++){const e=new T.Mesh(sph,new T.MeshStandardMaterial({color:0x58c7ff,emissive:0x1a6aa0,roughness:0.3}));e.scale.setScalar(0.055);tilt.add(e);
   const a0=i/cnt*Math.PI*2,w=1.2/(s+1);VW.anim.push(t=>{const a=a0+t*w;e.position.set(Math.cos(a)*R,Math.sin(a)*R,0);});}
  els.push(tilt);});
 addPart('e','Электрон ('+Z+': '+sh.join(', ')+')','Сөрөг цэнэгтэй хөнгөн бөөмс. Давхаргаар байрлана: 1-д 2, 2-т 8, 3-т 8 хүртэл. Гадаад давхаргынх нь химийн шинжийг тодорхойлно.',els);
 frame(0.6+sh.length*0.45,v3(0.2,0.5,1).normalize());chipsFor(false);
 return ZN[Z]+' — Z = '+Z;}

/* ================= 3. АМЬТНЫ ЭС ================= */
function showCell(){clear();VW.kind='cell';seed=11;
 // Эсийн нэг дөрөвний хэсгийг (x > −0.25 ба z > −0.2) огтолж дотрыг харуулна: хоёр хавтгайн огтлолцол
 const cl=[new T.Plane(v3(-1,0,0),-0.25),new T.Plane(v3(0,0,-1),-0.2)];
 // Эсийн мембран: органик хэлбэртэй бөмбөрцөг, огтлолтой
 const mg=bumpy(new T.SphereGeometry(2,128,96),0.06,1.6);
 const memO=new T.Mesh(mg,mat(0xe9b9a8,{transmission:0,opacity:0.95,transparent:true,clippingPlanes:cl,roughness:0.45,sheen:1,sheenColor:new T.Color(0xffd9cc)}));
 const memI=new T.Mesh(mg.clone().scale(0.985,0.985,0.985),mat(0xc98f84,{side:T.BackSide,clippingPlanes:cl}));
 addPart('mem','Эсийн мембран','Фосфолипидын давхар давхарга. Юу орж, гарахыг хянаж эсийг хамгаална. Дотор нь суваг, рецептор уураг шигтгээтэй.',[memO,memI],v3(0.5,0.2,0.5));
 // Цитоплазм: дотор талын бүдэг шингэн (харагдах байдал)
 const cyto=new T.Mesh(new T.SphereGeometry(1.94,64,48),new T.MeshStandardMaterial({color:0xf3d9c6,transparent:true,opacity:0.12,depthWrite:false,clippingPlanes:cl,side:T.BackSide}));
 addPart('cyto','Цитоплазм','Эсийн доторх шингэн (цитозол) ба эрхтэнцрүүд. Олон химийн урвал, гликолиз энд явагдана.',[cyto]);
 // Бөөм: хоёр давхар мембран, бөөмийн нүхнүүд, бөөмхөн, хроматин
 const nuc=new T.Group();
 const ng=bumpy(new T.SphereGeometry(0.72,96,72),0.02,3);
 nuc.add(new T.Mesh(ng,mat(0x7a5ba8,{clippingPlanes:cl,roughness:0.5,clearcoat:0.5})));
 nuc.add(new T.Mesh(ng.clone().scale(0.96,0.96,0.96),mat(0x5b3f86,{side:T.BackSide,clippingPlanes:cl})));
 const pore=new T.TorusGeometry(0.035,0.012,8,16),pm=mat(0xd7c3f0,{clippingPlanes:cl});
 for(let i=0;i<70;i++){const k=i+0.5,ph=Math.acos(1-2*k/70),th=Math.PI*(1+Math.sqrt(5))*k,n=v3(Math.sin(ph)*Math.cos(th),Math.cos(ph),Math.sin(ph)*Math.sin(th));
  const m=new T.Mesh(pore,pm);m.position.copy(n).multiplyScalar(0.735);m.lookAt(n.clone().multiplyScalar(2));nuc.add(m);}
 nuc.position.set(-0.25,0.1,-0.2);
 const nucP=addPart('nuc','Бөөм','ДНХ (удамшлын мэдээлэл) хадгалж эсийг удирдана. Хоёр давхар мембрантай, бөөмийн нүхээр мРНХ гадагш гарна.',[nuc],v3(-0.3,0.6,-0.3));
 const nol=new T.Mesh(bumpy(new T.SphereGeometry(0.22,48,36),0.02,9),mat(0x3b2457,{clippingPlanes:cl,roughness:0.7}));nol.position.set(-0.2,0.15,-0.15);
 addPart('nol','Бөөмхөн','Бөөм доторх нягт хэсэг — рибосомын РНХ үүсч, рибосомын хэсгүүд угсрагдана.',[nol],v3(-0.3,0.6,-0.3));
 // Хроматин: бөөм доторх ороомог утаснууд
 const chr=[];const cm=mat(0xb48ad8,{clippingPlanes:cl,roughness:0.6});
 for(let i=0;i<14;i++){const pts=[];let p=v3(srnd(-0.4,0.4),srnd(-0.4,0.4),srnd(-0.4,0.4));
  for(let j=0;j<10;j++){p=p.clone().add(v3(srnd(-0.18,0.18),srnd(-0.18,0.18),srnd(-0.18,0.18)));if(p.length()>0.6)p.multiplyScalar(0.6/p.length());pts.push(p);}
  const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),60,0.012,6),cm);m.position.copy(nuc.position);chr.push(m);}
 addPart('chr','Хроматин (ДНХ)','ДНХ ба уургийн цогцолбор. Эс хуваагдахад нягтарч хромосом болно. Хүний эсэд 46 хромосом.',chr,v3(-0.3,0.6,-0.3));
 // Барзгар эндоплазмын тор: бөөмийг тойрсон долгионт хуудаснууд + рибосом цэгүүд
 const rer=[],rm=mat(0x5fa8c9,{clippingPlanes:cl,roughness:0.45,clearcoat:0.4});const ribs=[];
 for(let i=0;i<6;i++){const R=0.86+i*0.085;const g=new T.SphereGeometry(R,72,36,Math.PI*0.95+i*0.05,Math.PI*0.9,Math.PI*0.25,Math.PI*0.5);
  const p=g.attributes.position;for(let k=0;k<p.count;k++){const x=p.getX(k),y=p.getY(k),z=p.getZ(k),s=1+0.035*Math.sin(y*14+i)+0.02*Math.sin(x*11);p.setXYZ(k,x*s,y*s,z*s);}g.computeVertexNormals();
  const m=new T.Mesh(g,rm);m.position.copy(nuc.position);rer.push(m);
  for(let k=0;k<160;k++){const vi=(Math.random()*p.count)|0;ribs.push(v3(p.getX(vi),p.getY(vi),p.getZ(vi)).add(nuc.position));}}
 const rib=new T.InstancedMesh(new T.SphereGeometry(0.014,8,6),mat(0x1f3c59,{clippingPlanes:cl}),ribs.length);
 const dm=new T.Object3D();ribs.forEach((p,i)=>{dm.position.copy(p);dm.updateMatrix();rib.setMatrixAt(i,dm.matrix);});
 addPart('rer','Барзгар эндоплазмын тор','Гадаргуу дээрээ рибосомтой тул «барзгар». Шүүрэх болон мембраны уураг нийлэгжиж, нугалагдана.',rer.concat([rib]),v3(0.7,0.2,0.4));
 // Гөлгөр эндоплазмын тор: салаалсан гуурсны сүлжээ
 const ser=[],sm=mat(0x8fd0c0,{});
 for(let i=0;i<10;i++){const pts=[];let p=v3(srnd(0.3,1.0),srnd(-0.9,-0.3),srnd(-0.2,0.6));
  for(let j=0;j<6;j++){p=p.clone().add(v3(srnd(-0.25,0.25),srnd(-0.15,0.15),srnd(-0.25,0.25)));pts.push(p);}
  ser.push(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,0.035,8),sm));}
 addPart('ser','Гөлгөр эндоплазмын тор','Рибосомгүй гуурсан сүлжээ. Липид, стероид нийлэгжүүлж, элэгний эсэд хорт бодисыг саармагжуулна.',ser,v3(0.3,-0.6,0.3));
 // Гольджийн аппарат: муруй хавтгай уутнуудын овоо + жижиг цэврүүнүүд
 const gol=[],gm=mat(0xf2b544,{roughness:0.4,clearcoat:0.5});
 for(let i=0;i<6;i++){const g=new T.SphereGeometry(0.55-i*0.03,48,12,0,Math.PI*0.75,Math.PI*0.42,Math.PI*0.16);
  const m=new T.Mesh(g,gm);m.scale.set(1,0.45,1);m.position.set(0.55,0.55+i*0.06,0.45);m.rotation.set(0,-0.7,0.2);gol.push(m);}
 const ves=[];for(let i=0;i<18;i++){const m=new T.Mesh(new T.SphereGeometry(srnd(0.03,0.06),16,12),gm);m.position.set(0.55+srnd(-0.5,0.5),0.6+srnd(-0.25,0.45),0.45+srnd(-0.4,0.4));ves.push(m);}
 addPart('gol','Гольджийн аппарат','ЭПТ-ээс ирсэн уургийг өөрчилж, «хаяглаж», цэврүүнд савлан эсийн гадна эсвэл бусад эрхтэнцэр рүү илгээнэ — эсийн «шуудан».',gol.concat(ves),v3(0.5,0.6,0.5));
 // Митохондриуд: капсул хэлбэртэй, гадаргуу нь органик
 const mito=[];const mmt=mat(0xe2733d,{roughness:0.5,clearcoat:0.35});
 for(let i=0;i<9;i++){const g=bumpy(new T.CapsuleGeometry(0.075,srnd(0.18,0.32),10,20),0.008,25);const m=new T.Mesh(g,mmt);
  const a=srnd(0,Math.PI*2),r=srnd(1.15,1.6),y=srnd(-0.9,0.9);m.position.set(Math.cos(a)*r*0.85,y,Math.sin(a)*r*0.85);m.rotation.set(srnd(0,3),srnd(0,3),srnd(0,3));mito.push(m);}
 addPart('mito','Митохондри','Эсийн «цахилгаан станц». Эсийн амьсгалаар глюкозыг исэлдүүлж АТФ үйлдвэрлэнэ. Өөрийн ДНХ-тэй. Тусдаа загварыг «Митохондри» товчоор үзнэ.',mito,v3(0.4,0,0.4));
 // Лизосом ба пероксисом: жижиг бөмбөлөгүүд
 const lys=[];const lm=mat(0x9b4fd6,{roughness:0.35,clearcoat:0.7});
 for(let i=0;i<10;i++){const m=new T.Mesh(new T.SphereGeometry(srnd(0.06,0.1),24,18),lm);const a=srnd(0,6.3),r=srnd(1.0,1.6);m.position.set(Math.cos(a)*r,srnd(-1,0.8),Math.sin(a)*r);lys.push(m);}
 addPart('lys','Лизосом','Хоол боловсруулах ферменттэй цэврүү (pH ~4.5–5). Хуучирсан эрхтэнцэр, залгисан нянг задална.',lys,v3(0.2,-0.2,0.6));
 // Чөлөөт рибосомууд: цитоплазмд тархсан маш олон жижиг цэг
 const fr=[];for(let i=0;i<900;i++){const p=v3(srnd(-1,1),srnd(-1,1),srnd(-1,1));if(p.length()>1)continue;p.multiplyScalar(1.85);if(p.distanceTo(nuc.position)<0.95)continue;fr.push(p);}
 const frm=new T.InstancedMesh(new T.SphereGeometry(0.012,6,5),mat(0x2e4f6e,{}),fr.length);
 fr.forEach((p,i)=>{dm.position.copy(p);dm.updateMatrix();frm.setMatrixAt(i,dm.matrix);});
 addPart('rib','Рибосом','Уураг нийлэгжүүлэх «үйлдвэр». мРНХ-ийг уншиж амин хүчлүүдийг холбоно. Чөлөөт ба ЭПТ дээрх гэж хоёр байрлалтай.',[frm]);
 // Центриол: 9 гурвалсан бичил гуурсаас тогтсон, хоорондоо перпендикуляр хос цилиндр
 const cen=new T.Group();const cm2=mat(0x6fd36a,{roughness:0.4});
 [0,1].forEach(k=>{const g=new T.Group();for(let i=0;i<9;i++){for(let j=0;j<3;j++){const a=i/9*Math.PI*2+j*0.09,r=0.07;
   const m=new T.Mesh(new T.CylinderGeometry(0.009,0.009,0.2,6),cm2);m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);g.add(m);}}
  if(k)g.rotation.z=Math.PI/2,g.position.x=0.17;cen.add(g);});
 cen.position.set(0.9,-0.2,1.1);
 addPart('cen','Центриол','9 гурвалсан бичил гуурснаас тогтсон хос цилиндр. Эс хуваагдахад хромосомыг татах «ээрүүл»-ийг зохион байгуулна.',[cen],v3(0.4,-0.3,0.6));
 // Эсийн араг яс: центросомоос цацрагласан бичил гуурсууд
 const cyt=[];const ctm=new T.LineBasicMaterial({color:0x9fe2a0,transparent:true,opacity:0.35});
 for(let i=0;i<60;i++){const d=v3(srnd(-1,1),srnd(-1,1),srnd(-1,1)).normalize();const pts=[cen.position.clone()];let p=cen.position.clone();
  for(let j=0;j<6;j++){p=p.clone().addScaledVector(d,0.25).add(v3(srnd(-0.05,0.05),srnd(-0.05,0.05),srnd(-0.05,0.05)));if(p.length()>1.9)break;pts.push(p);}
  cyt.push(new T.Line(new T.BufferGeometry().setFromPoints(pts),ctm));}
 addPart('cyt','Эсийн араг яс','Бичил гуурс, утаснуудын сүлжээ. Эсийн хэлбэрийг барьж, эрхтэнцэр ба цэврүүг «зам» шиг зөөнө.',cyt);
 // Огтлох хоёр хавтгайн «огтлолцол» дээр л таслах (дөрөвний нэг хэсэг)
 VW.root.traverse(o=>{if(o.material&&o.material.clippingPlanes)o.material.clipIntersection=true;});
 frame(2.25,v3(0.75,0.35,0.9).normalize());chipsFor(true);
 VW.anim.push(t=>{VW.root.rotation.y=0.25*Math.sin(t*0.15);});
 return 'Амьтны эс (огтлол)';}

/* ================= 4. МИТОХОНДРИ ================= */
// Сурах бичгийн огтлолтой адил: гадна мембран (капсул), дотор мембран нь дотогшоо атираа (криста) үүсгэнэ.
function showMito(){clear();VW.kind='mito';seed=5;
 const cl=[new T.Plane(v3(0,0,-1),0.0)];                               // урд талын (z>0) хагасыг огтолж дотрыг харуулах
 const L=1.4,RO=0.62,RI=0.55,TH=0.035,DEP=0.56;                        // урт, гадна/дотор радиус, мембраны зузаан, гүн
 // Капсулын хагас өндөр: x байрлал дахь дээд ирмэгийн y (r радиустай)
 const hx=(x,r)=>{const ax=Math.abs(x)-L/2;return ax<=0?r:Math.sqrt(Math.max(0,r*r-ax*ax));};
 // Капсулын хүрээ (2D) — r радиустай, n цэгтэй
 function outline(r,n){const pts=[];for(let i=0;i<=n;i++){const t=i/n*Math.PI*2;                       // параметрээр тойрох
   const cx=Math.cos(t)>=0?L/2:-L/2;pts.push(new T.Vector2(cx+r*Math.cos(t),r*Math.sin(t)));}return pts;}
 // Гүн (z) рүү орох тусам капсулын хөндлөн огтлол нарийсдаг тул хэлбэрийг шахах — гаднаас цухуйхгүй
 function fitCapsule(g){const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const z=p.getZ(i),f=Math.sqrt(Math.max(0.05,1-(z*z)/(RO*RO*0.98)));let x=p.getX(i);const ax=Math.abs(x)-L/2;
   if(ax>0)x=Math.sign(x)*(L/2+ax*f);p.setXYZ(i,x,p.getY(i)*f,z);}g.computeVertexNormals();return g;}
 // 2D хэлбэрийг z = 0 ... −DEP хооронд гүнзгийрүүлж (extrude), капсулд тааруулах
 const ext=(shape,d)=>{const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,curveSegments:24,steps:8});g.translate(0,0,-d);return fitCapsule(g);};
 // 1) Гадна мембран
 const og=bumpy(new T.CapsuleGeometry(RO,L,24,64),0.01,6);og.rotateZ(Math.PI/2);
 const outer=[new T.Mesh(og,mat(0xd9783f,{clippingPlanes:cl,roughness:0.45,clearcoat:0.45,sheen:0.6,sheenColor:new T.Color(0xffc8a0)})),
  new T.Mesh(og.clone().scale(0.985,0.985,0.985),mat(0xa94f26,{side:T.BackSide,clippingPlanes:cl}))];
 addPart('om','Гадна мембран','Гөлгөр, порин сувагтай тул жижиг молекул нэвтэрнэ. Митохондрийг бүхэлд нь хүрээлнэ.',outer,v3(0,0.25,0.7));
 // Мембран хоорондын зай — гадна ба дотор мембраны хоорондох нарийн хөндий (бүдэг ягаан давхарга)
 const ims=new T.Shape(outline(RO-0.012,96));ims.holes.push(new T.Path(outline(RI,96)));
 const imsM=new T.Mesh(ext(ims,DEP*0.98),new T.MeshStandardMaterial({color:0xf3c2b0,transparent:true,opacity:0.35,depthWrite:false,side:T.DoubleSide}));
 addPart('ims','Мембран хоорондын зай','Электрон тээвэрлэх гинж H⁺ ионыг энд шахаж хуримтлуулна — АТФ үүсгэх «далан».',[imsM]);
 // 2) Дотор мембран (хүрээ) — зузаан TH туузан хэлбэр
 const band=new T.Shape(outline(RI,96));band.holes.push(new T.Path(outline(RI-TH,96)));
 const imCap=mat(0xf6c27a,{roughness:0.5,clearcoat:0.3}),imSide=mat(0xe39a55,{roughness:0.6});
 const inner=[new T.Mesh(ext(band,DEP),[imCap,imSide])];
 // 3) Криста: дотор мембран дотогшоо нугалсан «U» хэлбэрийн атираа (хоёр давхар мембран, дундаа нарийн зай)
 const cr=[],crx=[],n=8,W=0.11,SL=0.04;                                 // атирааны тоо, өргөн, доторх зайны өргөн
 for(let i=0;i<n;i++){const x=-L*0.56+i*(L*1.12/(n-1)),top=i%2===0;     // ээлжлэн дээрээс, доороос
  const h=hx(x,RI-TH*0.5),d=h*srnd(0.8,1.2);                          // ирмэгээс хэр гүн орох
  const sg=top?1:-1,y0=sg*h,tip=sg*(h-d);                               // эхлэл ба үзүүрийн y
  const sh=new T.Shape();                                               // «U» хэлбэр: гадна зах → үзүүр (хагас тойрог) → дотор зах
  sh.moveTo(x-W/2,y0);sh.lineTo(x-W/2,tip+sg*W/2);
  sh.absarc(x,tip+sg*W/2,W/2,Math.PI,0,top);sh.lineTo(x+W/2,y0);
  sh.lineTo(x+SL/2,y0);sh.lineTo(x+SL/2,tip+sg*W/2);
  sh.absarc(x,tip+sg*W/2,SL/2,0,Math.PI,!top);sh.lineTo(x-SL/2,y0);sh.lineTo(x-W/2,y0);
  // Үзүүрийг жаахан муруйлгах — амьд эсийнх шиг долгионтой
  const g=ext(sh,DEP);const p=g.attributes.position;
  for(let k=0;k<p.count;k++){const yy=p.getY(k),zz=p.getZ(k);p.setX(k,p.getX(k)+0.035*Math.sin((yy*5+zz*4)+i));}g.computeVertexNormals();
  cr.push(new T.Mesh(g,[imCap,imSide]));crx.push({x,top,tip,h});}
 addPart('im','Дотор мембран','Электрон тээвэрлэх гинж ба АТФ синтаза энд байрлана. Ихэнх ион нэвтрүүлдэггүй тул H⁺-ийн градиент хадгалагдана.',inner,v3(0,0,0.3));
 addPart('cr','Криста','Дотор мембраны нугалаа. Талбайг олон дахин нэмэгдүүлж, илүү олон АТФ синтаза багтаана. Их энерги хэрэглэдэг эс (зүрх, булчин) олон кристатай.',cr,v3(0,0,0.15));
 // 4) Матриц: дотор хөндийн шингэн — ар талын хавтгай + бүдэг дүүргэлт
 const mxs=new T.Shape(outline(RI-TH,96));
 const back=new T.Mesh(fitCapsule(new T.ShapeGeometry(mxs,24).translate(0,0,-DEP*0.92)),new T.MeshStandardMaterial({color:0xffe6b8,roughness:0.9,side:T.DoubleSide}));
 const fill=new T.Mesh(ext(mxs,DEP*0.9),new T.MeshStandardMaterial({color:0xfff0cf,transparent:true,opacity:0.12,depthWrite:false,side:T.DoubleSide}));
 addPart('mx','Матриц','Дотор мембраны дотор талын өтгөн шингэн. Кребсийн цикл, өөх тосны хүчлийн исэлдэлт энд явагдана.',[back,fill]);
 // Криста хооронд байх эсэхийг шалгах (жижиг биетүүдийг кристатай давхцуулахгүйн тулд)
 const free=(x,y)=>crx.every(c=>Math.abs(x-c.x)>W*0.75||(c.top?y<c.tip-0.03:y>c.tip+0.03));
 const inMx=(x,y,z)=>{const f=Math.sqrt(Math.max(0.05,1-(z*z)/(RO*RO)));return Math.abs(y)<(hx(x,RI-TH)-0.04)*f;};
 const spot=(zmin,zmax)=>{for(let k=0;k<200;k++){const x=srnd(-L/2-0.3,L/2+0.3),y=srnd(-0.45,0.45),z=srnd(zmin,zmax);if(inMx(x,y,z)&&free(x,y))return v3(x,y,z);}return v3(0,0,-0.2);};
 // 5) Митохондрийн ДНХ — жижиг цагираг молекулууд
 const dna=[];const dm=mat(0x55c8ff,{roughness:0.35,emissive:0x000000});
 for(let i=0;i<4;i++){const m=new T.Mesh(new T.TorusKnotGeometry(0.045,0.006,90,6,2,3),dm);m.position.copy(spot(-0.3,-0.06));m.rotation.set(srnd(0,3),srnd(0,3),0);dna.push(m);}
 addPart('dna','Митохондрийн ДНХ','Цагираг хэлбэртэй, 37 гентэй. Зөвхөн эхээс удамшдаг.',dna,v3(0,0,0.25));
 // 6) Рибосом ба мөхлөгүүд
 const rb=[];for(let i=0;i<55;i++)rb.push(spot(-0.35,-0.03));
 const rbi=new T.InstancedMesh(new T.SphereGeometry(0.014,8,6),mat(0x2b4b6b),rb.length);const o=new T.Object3D();
 rb.forEach((p,i)=>{o.position.copy(p);o.updateMatrix();rbi.setMatrixAt(i,o.matrix);});
 const gr=[];for(let i=0;i<12;i++){const m=new T.Mesh(new T.SphereGeometry(srnd(0.02,0.035),12,10),mat(0x8a5a3a,{roughness:0.4}));m.position.copy(spot(-0.3,-0.05));gr.push(m);}
 addPart('rb','Рибосом (70S)','Митохондри өөрийн жижиг рибосомтой — бактерийнхтай төстэй. Митохондри эртний бактериас гаралтай гэсэн онолын нэг нотолгоо.',[rbi],v3(0,0,0.2));
 addPart('gr','Мөхлөг','Матриц дахь кальци, магнийн нягт мөхлөгүүд.',gr,v3(0,0,0.2));
 // 7) АТФ синтаза: криста ба дотор мембраны матриц талын гадаргуу дээрх «чихэр» хэлбэрийн уураг
 const at=[];const ah=new T.SphereGeometry(0.018,10,8),as=new T.CylinderGeometry(0.005,0.005,0.03,6),am=mat(0xfff06a,{roughness:0.3});
 crx.forEach(c=>{const sg=c.top?1:-1;for(let k=0;k<6;k++){const y=sg*(c.h-0.07-k*((c.h-Math.abs(c.tip))/6+0.01));if(Math.abs(y)<Math.abs(c.tip)&&sg*y<sg*c.tip)continue;
   [-1,1].forEach(side=>{const z=-0.02-srnd(0,0.06);const st=new T.Mesh(as,am);st.rotation.z=Math.PI/2;st.position.set(c.x+side*(W/2+0.015),y,z);
    const hd=new T.Mesh(ah,am);hd.position.set(c.x+side*(W/2+0.038),y,z);at.push(st,hd);});}});
 addPart('atp','АТФ синтаза','H⁺ ионы урсгалаар «турбин» шиг эргэж ADP ба фосфатаас АТФ үүсгэдэг фермент.',at,v3(0,0,0.35));
 frame(1.45,v3(0.12,0.38,1).normalize());chipsFor(true);
 VW.anim.push(t=>{VW.root.rotation.y=0.3*Math.sin(t*0.2);});
 return 'Митохондри (огтлол)';}

/* ---------- Гадагш нээх API ---------- */
// LV3.show(box, act) — act={a:'mol',k}|{a:'atom',z}|{a:'cell'}|{a:'mito'}; гарчгийг буцаана
window.LV3={
 show(box,act){mount(box);VW.t0=performance.now();VW.r.clippingPlanes=[];
  const title=act.a==='mol'?showMol(act.k):act.a==='atom'?showAtom(act.z):act.a==='cell'?showCell():showMito();
  return title||'';},
 stop, resize, mols:MOLS
};
})();
