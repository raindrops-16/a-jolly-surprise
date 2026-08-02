/* ================= EDIT ME =================
   1. Set your real password below.
   2. Drop your PNGs into /images using the exact filenames listed.
   3. Optional: drop small icon PNGs into /images/icons (see ICON filenames)
      — otherwise a matching emoji is used automatically.
   4. Drop your song into /audio/song.mp3 — without this file the music
      button has nothing to play.
=============================================== */
const SITE_PASSWORD = "changeme";

const CHARACTERS = [
  { key:"tsukune", name:"Tsukune", img:"tsukune.png", color:"#967969", icon:"🧛‍♂️",
    msg:"Happy Birthday! I hope you have an awesome day and that all your wishes come true. Thanks for everything, and here's to another great year. Enjoy your special day! 👊" },
  { key:"yukari", name:"Yukari", img:"yukari.png", color:"#9b5de5", icon:"🪄",
    msg:"Ta-da! Happy Birthday! 🎂 I've cast my special birthday spell just for you! May your year be full of happiness, good luck, and amazing adventures! Save me a slice of cake, okay? Hehe! 💜" },
  { key:"moka-inner", name:"Moka (Inner)", img:"Moka-inner.png", color:"#d90429", icon:"✝️",
    msg:"I don't usually say things like this... but I'm glad you're here today. Don't waste today worrying about the past. Celebrate, smile, and become even stronger. Happy Birthday!" },
  { key:"kurumu", name:"Kurumu", img:"kurumu.png", color:"#00b7c2", icon:"🦇",
    msg:"Happy Birthday! I hope today is filled with happiness, sweet surprises, and wonderful memories. You deserve to smile all day long! Have an amazing birthday, okay? 💙" },
  { key:"jollibee", name:"Jollibee & Friends", img:"jollibee.png", color:"#ffb703", icon:"🐝",
    msg:"Happy Birthday to you! We hope your day is filled with love, laughter, yummy food, and the people who make you smile. Have a Jolly Happy Birthday! 🎉🎂" },
  { key:"hellokitty", name:"Hello Kitty & Friends", img:"kitty.png", color:"#2a9d8f", icon:"🎀",
    msg:"Happy Birthday! We hope your special day is filled with love, laughter, friendship, and magical memories! We love you! 🎂🎈💖" },
  { key:"mizore", name:"Mizore", img:"Mizore.png", color:"#6a4c93", icon:"❄️",
    msg:"Happy birthday. I... made this just for you. I hope it makes you smile. May this year bring you lots of happiness. 💙❄️" },
  { key:"moka-outer", name:"Moka (Outer)", img:"moka-outer.png", color:"#ff5f8f", icon:"🌸",
    msg:"Happy Birthday! Yay! I'm so happy I get to celebrate with you. Eat lots of cake, have tons of fun — I'll always be cheering you on! 🌹💕" },
  { key:"bubu-dudu", name:"Bubu & Dudu", img:"bubu.png", color:"#4a4a4a", icon:"🧸",
    msg:"Happy Birthday, our favorite human! Eat lots of cake, make wonderful memories, and never forget how loved you are. Biggest bear hug ever! 🎂🎁" },
  { key:"captain-ri-seri", name:"Captain Ri & Se-ri", img:"cloy.png", color:"#a0522d", icon:"🪂",
    msg:"No matter where destiny takes you, may you always find warmth, joy, and peace. Happy birthday! 🌸" },
  { key:"winnie-pooh", name:"Winnie the Pooh & Friends", img:"pooh.png", color:"#f4a261", icon:"🍯",
    msg:"Happy Birthday! We hope your day is filled with friendship, laughter, love, and sweet memories. Have a wonderful birthday! 🎂🍯" }
];

const ANIMALS = [
  { id:"dog1", fallbackEmoji:"🐶", idleImg:null, walkImg:"dog-walk.gif", poseImg:"dogpose.gif", pawColor:"#c77b4a", size:1.0 },
  { id:"dog2", fallbackEmoji:"🐕", idleImg:null, walkImg:"dog-walk.gif", poseImg:"dogpose.gif", pawColor:"#7a5230", size:0.85 },
  { id:"cat1", fallbackEmoji:"🐱", idleImg:"cat1.png", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", pawColor:"#e0b0ff", size:0.9 },
  { id:"cat2", fallbackEmoji:"🐈", idleImg:"cat2.png", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", pawColor:"#ff9ecb", size:1.05 }
];

/* ---------- password gate ---------- */
document.getElementById("unlockBtn").addEventListener("click", tryUnlock);
document.getElementById("pwInput").addEventListener("keydown", e=>{ if(e.key==="Enter") tryUnlock(); });
function tryUnlock(){
  const val = document.getElementById("pwInput").value;
  if(val === SITE_PASSWORD){
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("site").style.display = "flex";
    initSite();
  } else {
    document.getElementById("lockError").textContent = "That's not quite it — try again 💫";
  }
}

/* ---------- build characters in a ring around the title ---------- */
function buildCharacters(){
  const stage = document.getElementById("stage");
  const n = CHARACTERS.length;
  const Rx = window.innerWidth < 480 ? 40 : 43;   // % of stage width
  const Ry = window.innerWidth < 480 ? 33 : 37;   // % of stage height
  const startAngle = -90 + (360/n)/2;

  CHARACTERS.forEach((c,i)=>{
    const angle = (startAngle + i*(360/n)) * Math.PI/180;
    const left = 50 + Rx*Math.cos(angle);
    const top  = 50 + Ry*Math.sin(angle);

    const card = document.createElement("div");
    card.className = "charCard";
    card.style.left = left+"%";
    card.style.top = top+"%";
    card.innerHTML = `
      <img src="images/${c.img}" alt="${c.name}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="charFallback" style="background:${c.color}">${c.name}</div>
      <div class="charName">${c.name}</div>
      <div class="balloonWrap">
        <div class="balloon" style="background:${c.color};">
          <span class="closeX">✕</span>
          <span class="icon">
            <img src="images/icons/${c.key}-icon.png" alt=""
                 onerror="this.style.display='none'; this.parentElement.textContent='${c.icon}';">
          </span>
          <span class="msg">${c.msg}</span>
        </div>
        <div class="knot" style="border-top-color:${c.color};"></div>
        <div class="string"></div>
      </div>`;
    const wrap = card.querySelector(".balloonWrap");
    const msgEl = card.querySelector(".msg");
    card.addEventListener("click", (e)=>{
      if(e.target.classList.contains("closeX")){ wrap.classList.remove("show"); card.classList.remove("pop"); return; }
      document.querySelectorAll(".balloonWrap.show").forEach(b=>{
        if(b!==wrap){ b.classList.remove("show"); b.closest(".charCard").classList.remove("pop"); }
      });
      const opening = !wrap.classList.contains("show");
      wrap.classList.toggle("show");
      card.classList.toggle("pop", opening);
      if(opening) fitBalloonText(msgEl);
    });
    stage.appendChild(card);
  });
}

/* shrink message text until it fits inside the round balloon */
function fitBalloonText(el){
  let size = 0.72;
  el.style.fontSize = size+"rem";
  let guard = 0;
  while(el.scrollHeight > el.clientHeight + 2 && size > 0.42 && guard < 20){
    size -= 0.03;
    el.style.fontSize = size+"rem";
    guard++;
  }
}

/* ---------- grass blades ---------- */
function buildGrass(){
  const grass = document.getElementById("grass");
  const w = grass.clientWidth;
  const count = Math.max(60, Math.round(w/9));
  const shades = ["#1c6b34","#217a3b","#155c2a","#2c8a45"];
  for(let i=0;i<count;i++){
    const b = document.createElement("div");
    b.className = "blade";
    const h = 24 + Math.random()*46;
    const width = 5 + Math.random()*5;
    const tilt = (Math.random()*26-13);
    b.style.left = (Math.random()*100)+"%";
    b.style.height = h+"px";
    b.style.width = width+"px";
    b.style.background = shades[Math.floor(Math.random()*shades.length)];
    b.style.transform = `rotate(${tilt}deg)`;
    b.style.zIndex = Math.round(h);
    grass.appendChild(b);
  }
}

/* ---------- animals: idle / walk / pose image states ---------- */
function setAnimalMode(el, a, mode){
  const img = el.querySelector("img");
  const src = mode === "walk" ? a.walkImg : mode === "pose" ? a.poseImg : a.idleImg;
  const oldFallback = el.querySelector(".animalFallback");
  if(oldFallback) oldFallback.remove();
  if(src){
    img.style.display = "";
    img.onerror = () => {
      img.style.display = "none";
      const fb = document.createElement("span");
      fb.className = "animalFallback";
      fb.textContent = a.fallbackEmoji;
      el.insertBefore(fb, el.firstChild);
    };
    // cache-bust so gifs restart cleanly each time we switch back to them
    img.src = "images/" + src + "?m=" + mode;
  } else {
    img.style.display = "none";
    const fb = document.createElement("span");
    fb.className = "animalFallback";
    fb.textContent = a.fallbackEmoji;
    el.insertBefore(fb, el.firstChild);
  }
}

function buildAnimals(){
  const grass = document.getElementById("grass");
  ANIMALS.forEach((a,i)=>{
    const el = document.createElement("div");
    el.className = "animal";
    el.style.left = (10 + i*22) + "%";
    el.style.transform = `scale(${a.size})`;
    el.innerHTML = `
      <img alt="${a.fallbackEmoji}">
      <div class="animalBubble">Happy birthday! 🎉</div>`;
    grass.appendChild(el);
    setAnimalMode(el, a, "idle");
    animateWalk(el, a);
    el.addEventListener("click", ()=>{
      if(el.classList.contains("posing")) return;
      el.classList.add("posing");
      setAnimalMode(el, a, "pose");
      el.querySelector(".animalBubble").classList.add("show");
      setTimeout(()=>{
        el.classList.remove("posing");
        el.querySelector(".animalBubble").classList.remove("show");
        setAnimalMode(el, a, "idle");
      }, 2200);
    });
  });
}
function animateWalk(el, a){
  function step(){
    if(el.classList.contains("posing")){ setTimeout(step, 400); return; }
    const grassW = document.getElementById("grass").clientWidth;
    const curLeftPx = el.offsetLeft;
    const target = Math.random()*(grassW-70);
    const dur = 2500 + Math.random()*2000;
    setAnimalMode(el, a, "walk");
    el.style.transition = `left ${dur}ms linear`;
    el.style.left = target + "px";
    el.style.transform = `scale(${a.size}) scaleX(${target < curLeftPx ? -1 : 1})`;
    dropPaws(el, a, dur);
    setTimeout(()=>{
      if(!el.classList.contains("posing")) setAnimalMode(el, a, "idle");
      setTimeout(step, 400 + Math.random()*1200);
    }, dur);
  }
  step();
}
function dropPaws(el, a, duration){
  const grass = document.getElementById("grass");
  const count = 5;
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const paw = document.createElement("span");
      paw.className = "pawprint";
      paw.textContent = "🐾";
      const size = 0.5 + Math.random()*0.7;
      paw.style.fontSize = size + "rem";
      paw.style.color = a.pawColor;
      paw.style.left = (el.offsetLeft + (Math.random()*20-10)) + "px";
      paw.style.bottom = (6 + Math.random()*10) + "%";
      grass.appendChild(paw);
      setTimeout(()=>paw.remove(), 6200);
    }, (duration/count)*i);
  }
}

/* ---------- ambient sky effects ---------- */
function buildRain(){
  const stage = document.getElementById("stage");
  for(let i=0;i<40;i++){
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = Math.random()*100+"%";
    d.style.animationDuration = (0.6+Math.random()*0.7)+"s";
    d.style.animationDelay = (Math.random()*2)+"s";
    d.style.opacity = (0.2+Math.random()*0.4);
    stage.appendChild(d);
  }
}
function buildFireflies(){
  const stage = document.getElementById("stage");
  for(let i=0;i<16;i++){
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.left = Math.random()*100+"%";
    f.style.top = (10+Math.random()*80)+"%";
    f.style.animationDelay = (Math.random()*4)+"s, "+(Math.random()*10)+"s";
    stage.appendChild(f);
  }
}
function buildSakura(){
  const stage = document.getElementById("stage");
  setInterval(()=>{
    const p = document.createElement("div");
    p.className = "petal";
    p.textContent = "🌸";
    p.style.left = Math.random()*100+"%";
    p.style.fontSize = (0.7+Math.random()*0.8)+"rem";
    const dur = 8+Math.random()*8;
    p.style.animationDuration = dur+"s";
    stage.appendChild(p);
    setTimeout(()=>p.remove(), dur*1000+500);
  }, 800);
}

/* ---------- music toggle ---------- */
function initMusic(){
  const btn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  const hint = document.getElementById("musicHint");
  btn.addEventListener("click", ()=>{
    if(audio.paused){
      audio.play().then(()=>{
        btn.classList.add("playing"); btn.textContent="🔊"; hint.style.display="none";
      }).catch(()=>{
        hint.textContent = "add audio/song.mp3 to enable music";
      });
    } else {
      audio.pause(); btn.classList.remove("playing"); btn.textContent="🎵";
    }
  });
}

function initSite(){
  buildCharacters();
  buildGrass();
  buildAnimals();
  buildRain();
  buildFireflies();
  buildSakura();
  initMusic();
}
window.addEventListener("resize", ()=>{ /* percentage-based layout reflows on its own */ });
