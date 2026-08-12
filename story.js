const notes=[
 {eyebrow:"Dobro, pogodila si",title:"Za ženu koja me trpi već godinama…",accent:"i još uvek tvrdi da me voli.",text:"Ovo je dokaz da poklon ne mora da bude skup — dovoljno je da ti dete bude snalažljivo, tajanstveno i trenutno bez para. 😄"},
 {eyebrow:"Mali uvod pre dokaza",title:"Kažu da iza svakog uspešnog deteta stoji majka.",accent:"I pita se gde je pogrešila.",text:"Šalu na stranu: hvala ti za svaki zagrljaj, ručak, savet i za impresivnu količinu strpljenja."}
];
const slides=[...notes.map(x=>({type:"note",...x})),...Array.from({length:27},(_,i)=>({type:"photo",src:`uspomene/uspomena-${String(i+1).padStart(2,"0")}.webp`,number:i+1})),{type:"video",src:"zavrsni-snimak-1.mp4",label:"Prva poruka"},{type:"video",src:"zavrsni-snimak-2.mp4",label:"I još jedna poruka"},{type:"final"}];
const app=document.querySelector("#app"),song=document.querySelector("#song");
let current=0,started=false,paused=false,playing=false,timer=null,touchX=0;
function esc(s){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function start(e){e.preventDefault();const input=document.querySelector("#answer"),hint=document.querySelector("#hint");if(input.value.trim().toLowerCase()!=="milan"){hint.textContent="Netačno. Ko li je pravio ovaj poklon? 😄";hint.className="wrong";return}started=true;song.volume=.58;song.play().then(()=>{playing=true;render()}).catch(()=>render());render()}
function next(){current=Math.min(current+1,slides.length-1);render()}
function prev(){current=Math.max(current-1,0);render()}
function schedule(){clearTimeout(timer);const s=slides[current];if(paused||s.type==="video"||s.type==="final")return;timer=setTimeout(next,s.type==="photo"?2600:5700)}
function togglePause(){paused=!paused;render()}
function toggleMusic(){if(playing){song.pause();playing=false;render()}else{song.play().then(()=>{playing=true;render()})}}
function render(){
 if(!started){app.innerHTML=`<section class="unlock-screen"><div class="soft-rings"></div><header><span class="monogram">M</span><span>ROĐENDANSKA TAJNA · 2026</span></header><div class="unlock-copy"><p class="eyebrow">Samo za jednu posebnu osobu</p><h1>Imam nešto za tebe.<br><em>Ali prvo test.</em></h1><form id="unlock"><label for="answer">Ko je najveća budala na svetu?</label><div><input id="answer" placeholder="Upiši ime…" autocomplete="off"><button>Otvori →</button></div><small id="hint">Trag: ime počinje slovom M.</small></form></div></section>`;document.querySelector("#unlock").addEventListener("submit",start);return}
 const s=slides[current],pct=(current+1)/slides.length*100;
 let content="";
 if(s.type==="note")content=`<div class="note-card"><p class="eyebrow">${esc(s.eyebrow)}</p><h2>${esc(s.title)}<br><em>${esc(s.accent)}</em></h2><p>${esc(s.text)}</p></div>`;
 if(s.type==="photo")content=`<div class="photo-slide"><img src="${s.src}" alt="Porodična uspomena ${s.number} od 27"><div class="photo-shade"></div><div class="photo-label"><span>${String(s.number).padStart(2,"0")}</span><p>${s.number<6?"Od starih fotografija…":s.number<16?"…preko svih naših dana…":"…do uspomena koje tek stvaramo."}</p></div></div>`;
 if(s.type==="video")content=`<div class="video-slide"><p class="eyebrow">Pojačaj zvuk</p><h2>${s.label} za tebe.</h2><video id="gift-video" controls playsinline preload="metadata" src="${s.src}"></video><small>Kada se snimak završi, idemo dalje.</small></div>`;
 if(s.type==="final")content=`<div class="final-card"><p class="eyebrow">I za kraj</p><h2>Srećan rođendan ženi koja je preživela mene sve ove godine!</h2><strong>Zaslužuješ orden. 🏅</strong><span>Voli te tvoj omiljeni finansijski promašaj — Milan.</span></div>`;
 app.innerHTML=`<section class="story story-${s.type}"><div class="progress"><i style="width:${pct}%"></i></div><header class="story-top"><span>${String(current+1).padStart(2,"0")} / ${slides.length}</span><div><button id="pause">${paused?"▶":"Ⅱ"}</button><button id="music">${playing?"♪":"♩"}</button></div></header>${content}<button class="nav prev" id="prev" ${current===0?"disabled":""}>‹</button><button class="nav next" id="next" ${current===slides.length-1?"disabled":""}>›</button><div class="swipe-hint">PREVUCI ZA SLEDEĆU USPOMENU</div></section>`;
 document.querySelector("#pause").onclick=togglePause;document.querySelector("#music").onclick=toggleMusic;document.querySelector("#prev").onclick=prev;document.querySelector("#next").onclick=next;
 const video=document.querySelector("#gift-video");if(video){video.onplay=()=>{song.pause();playing=false;paused=true};video.onended=()=>{current=Math.min(current+1,slides.length-1);render()}}
 schedule();
}
app.addEventListener("touchstart",e=>touchX=e.changedTouches[0].clientX,{passive:true});app.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)(d<0?next:prev)()},{passive:true});song.onended=()=>{playing=false;render()};render();
