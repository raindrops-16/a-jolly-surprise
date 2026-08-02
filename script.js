/* ======================================================================
   EVERYTHING YOU'RE LIKELY TO EDIT LIVES IN THIS FILE. Quick map:

   1. SITE_PASSWORD    → the password he types to get in
   2. MUSIC_FILE        → the filename of your mp3 (must sit in /audio)
   3. CHARACTERS         → one entry per character (image, colors, font, message).
                            balloonFontSize / balloonMinFontSize control the text
                            size on desktop; add balloonFontSizeMobile /
                            balloonMinFontSizeMobile to any character to set a
                            DIFFERENT size just for phones (falls back to the
                            desktop values if you don't set them).
   4. LAYOUT              → EVERY character's x, y, width, and z-index —
                            this is how you position/resize/layer them.
                            Easiest way to get these numbers: click the
                            🖐️ button on the live page, drag characters
                            where you want them, scroll over one to
                            resize it, click one to bring it to front,
                            then hit "Copy layout code" and paste the
                            result over the LAYOUT object below.
   5. ANIMALS         → dog/cat filenames for idle / walking / posing,
                        walking speed, size, and a reverseFacing fix-it flag
=============================================== */

const SITE_PASSWORD = "changeme";
const MUSIC_FILE = "birthday-ost.mp3";   // must be inside the /audio folder

const CHARACTERS = [
  { key:"tsukune", name:"Tsukune", img:"tsukune.png", color:"#424194", icon:"🧛‍♂️",
    iconFile:"vampire-icon.png", font:"'Sue Ellen Francisco', cursive",
    balloonFontSize:2.4, balloonMinFontSize:1.4,
    balloonFontSizeMobile:1.6, balloonMinFontSizeMobile:0.9,
    msg:"Happy Birthday! I hope you have an awesome day and that all your wishes come true. Thanks for everything, and here's to another great year. Enjoy your special day! 👊" },

  { key:"yukari", name:"Yukari", img:"yukari.png", color:"#9b5de5", icon:"🪄",
    font:"'Crafty Girls', cursive", balloonFontSize:1.36,
    msg:"Ta-da! Happy Birthday! 🎂 I've cast my special birthday spell just for you! May your year be full of happiness, good luck, and amazing adventures! Don't forget to save me a slice of cake, okay? Hehe! 💜🪄" },

  { key:"moka-inner", name:"Inner Moka", img:"Moka-inner.png", color:"#f389a9", icon:"🦷",
    iconFile:"moka-inner-icon.png", font:"'Comforter Brush', cursive", balloonFontSize:1.55,
    msg:"I don't usually say things like this... but I'm glad you're here today. Don't waste today worrying about the past. Celebrate, smile, and become even stronger. I hope this year brings you happiness worth remembering. I'll be expecting great things from you next year, too. Happy Birthday! " +
        "<img class=\"inlineIcon\" src=\"images/icons/fangs-icon.png\" alt=\"🦷\" onerror=\"this.replaceWith(document.createTextNode('🦷'));\">" },

  { key:"kurumu", name:"Kurumu", img:"kurumu.png", color:"#df0747", icon:"🦇",
    iconFile:"wings-icon.png", font:"'Emilys Candy', cursive", balloonFontSize:1.52,
    msg:"Happy Birthday! I hope today is filled with lots of happiness, sweet surprises, and wonderful memories. You deserve to smile all day long! Hehe... I wish I could spend the whole day celebrating with you. Have an amazing birthday, okay? 💙" },

  { key:"jollibee", name:"Jollibee & Friends", img:"jollibee.png", color:"#ffb703", icon:"🐝",
    iconFile:"bee-icon.png", font:"'Indie Flower', cursive", balloonFontSize:1.68,
    msg:"Happy Birthday to you! We hope your day is filled with love, laughter, yummy food, and the people who make you smile. Wishing you a year full of happiness and exciting adventures. Have a Jolly Happy Birthday! 🎉🎂🎈" },

  { key:"hellokitty", name:"Hello Kitty & Friends", img:"kitty.png", color:"#2a9d8f", icon:"🎀",
    font:"'Englebert', cursive", balloonFontSize:1.56,
    msg:"Happy Birthday! We hope your special day is filled with love, laughter, friendship, and magical memories! Have the most wonderful birthday ever! We love you! 🎂🎈🎁💖" },

  { key:"mizore", name:"Mizore", img:"Mizore.png", color:"#6a4c93", icon:"❄️",
    iconFile:"snowflakes-icon.png", font:"'Snowburst One', cursive", balloonFontSize:1.45,
    msg:"Happy birthday. I... made this just for you. I hope it makes you smile. May this year bring you lots of happiness... and I'll be wishing for your dreams to come true too. 💙❄️" },

  { key:"moka-outer", name:"Outer Moka", img:"moka-outer.png", color:"#00b7c2", icon:"🌸",
    iconFile:"moka-outer-icon.png", font:"'Liu Jian Mao Cao', cursive", balloonFontSize:1.27,
    msg:"Happy Birthday! Yay! I'm so happy I get to celebrate this special day with you. May your heart always be filled with love, your dreams come true, and every day bring you something to smile about! Eat lots of delicious cake, have tons of fun, and remember that I'll always be cheering you on. Have an amazing birthday! 🌹💕😘" },

  { key:"bubu-dudu", name:"Bubu & Dudu", img:"bubu.png", color:"#ffffff", textColor:"#12204a", icon:"🧸",
    iconFile:"bear-icon.png", font:"'Sunshiney', cursive", balloonFontSize:1.44,
    msg:"Happy Birthday, our favorite human! Today is all about you! Eat lots of cake, make wonderful memories, laugh from your heart, and never forget how loved you are. We're giving you the biggest Bubu & Dudu bear hug ever! Have the happiest birthday! 🎂🎈🎁💖" },

  { key:"captain-ri-seri", name:"Captain Ri & Se-ri", img:"cloy.png", color:"#42d814", icon:"🪂",
    font:"'Mystery Quest', cursive", balloonFontSize:2.0,
    msg:"No matter where destiny takes you, may you always find warmth, joy, and peace. Happy birthday! 🌸" },

  { key:"winnie-pooh", name:"Winnie the Pooh & Friends", img:"pooh.png", color:"#f4a261", icon:"🍯",
    font:"'Sniglet', cursive", balloonFontSize:1.85,
    msg:"Happy Birthday! We hope your day is filled with friendship, laughter, love, and sweet memories. Have a wonderful birthday! 🎂🍯" }
];
const CHAR_BY_KEY = Object.fromEntries(CHARACTERS.map(c => [c.key, c]));

// Warm up the custom Google Fonts and icon images as soon as the page
// loads so the first balloon and bubble feel instant and consistent.
(function preloadBalloonFonts(){
  if(!(window.document && document.fonts && document.fonts.load)) return;
  const families = [...new Set(CHARACTERS.map(c => c.font).filter(Boolean))];
  families.push("'Mountains of Christmas', cursive", "'Fontdiner Swanky', cursive", "'Rock Salt', cursive");
  families.forEach(f => { document.fonts.load(`700 1em ${f}`).catch(()=>{}); });

  const iconFiles = [...new Set(CHARACTERS.map(c => c.iconFile || `${c.key}-icon.png`).filter(Boolean))];
  iconFiles.forEach(file => {
    const img = new Image();
    img.src = `images/icons/${file}`;
  });
})();

/* ---------- WHERE / HOW BIG / WHICH LAYER EACH CHARACTER IS ----------
   x, y  → position of the character's CENTER, as a % of the screen
   width → reference size in px on a normal desktop screen
   z     → stacking order — a HIGHER number renders IN FRONT.

   TWO layouts: LAYOUT_DESKTOP is used above MOBILE_BREAKPOINT, and
   LAYOUT_MOBILE below it — this is what lets you have a totally
   different arrangement for his Samsung S23 Ultra vs. a monitor,
   instead of one set of percentages trying (and failing) to look right
   on both a tall phone and a wide screen at once.

   Fastest way to get these exactly how you want, for EITHER layout:
   open the page at that screen size (or resize your browser window
   down below 480px wide to test the phone layout), use the 🖐️ edit
   mode, drag things where you want, then hit "Copy layout code" — it
   gives you safe lines to paste UNDER the existing declaration (never
   replace the "const LAYOUT_MOBILE = {...}" block itself, or you'll
   get a duplicate-declaration error that breaks the whole page). */
const MOBILE_BREAKPOINT = 480;   // EDIT: screen width (px) where it switches to the phone layout

const LAYOUT_DESKTOP = {
  "yukari": { x: 46.0, y: 29.3, width: 251, z: 28 },
  "kurumu": { x: 33.0, y: 27.8, width: 249, z: 26 },
  "mizore": { x: 57.4, y: 27.0, width: 217, z: 21 },
  "tsukune": { x: 67.1, y: 27.0, width: 214, z: 29 },
  "moka-inner": { x: 21.6, y: 52.6, width: 330, z: 21 },
  "moka-outer": { x: 76.6, y: 55.9, width: 220, z: 23 },
  "winnie-pooh": { x: 89.7, y: 26.8, width: 235, z: 46 },
  "bubu-dudu": { x: 89.7, y: 72.1, width: 284, z: 50 },
  "hellokitty": { x: 49.5, y: 74.9, width: 366, z: 43 },
  "captain-ri-seri": { x: 10.5, y: 66.7, width: 281, z: 39 },
  "jollibee": { x: 9.9, y: 22.9, width: 311, z: 47 },
};

// Starts as a copy of the desktop layout so nothing is missing/broken
// on first load — go edit these on his actual phone (or a narrow
// browser window) to fine-tune them independently.
const LAYOUT_MOBILE = {
  "yukari": { x: 46.0, y: 29.3, width: 251, z: 28 },
  "kurumu": { x: 33.0, y: 27.8, width: 249, z: 26 },
  "mizore": { x: 57.4, y: 27.0, width: 217, z: 21 },
  "tsukune": { x: 67.1, y: 27.0, width: 214, z: 29 },
  "moka-inner": { x: 21.6, y: 52.6, width: 330, z: 21 },
  "moka-outer": { x: 76.6, y: 55.9, width: 220, z: 23 },
  "winnie-pooh": { x: 89.7, y: 26.8, width: 235, z: 46 },
  "bubu-dudu": { x: 89.7, y: 72.1, width: 284, z: 50 },
  "hellokitty": { x: 49.5, y: 74.9, width: 366, z: 43 },
  "captain-ri-seri": { x: 10.5, y: 66.7, width: 281, z: 39 },
  "jollibee": { x: 9.9, y: 22.9, width: 311, z: 47 },
};

const IS_MOBILE_LAYOUT = window.innerWidth <= MOBILE_BREAKPOINT;
const LAYOUT = IS_MOBILE_LAYOUT ? LAYOUT_MOBILE : LAYOUT_DESKTOP;

// idleImg = picture while resting, walkImg/poseImg = default walking/posing
// gifs (used for BOTH directions, mirrored with CSS via reverseFacing).
//
// width = reference size in px on a normal desktop screen — auto-scales
// on smaller screens (same --ui-scale system as the characters). EDIT
// this number directly to resize any single animal — the box is now a
// fixed square, so this fully controls the size regardless of that
// animal's own image proportions.
//
// If you'd rather send a separate gif for each direction (so nothing
// needs to be mirrored), just add walkImgLeft / walkImgRight — when
// both are set, they're used directly with no mirroring, and walkImg /
// reverseFacing are ignored for that animal.
const ANIMALS = [
  { id:"dog1", fallbackEmoji:"🐶", idleImg:"dog1-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:110, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"dog2", fallbackEmoji:"🐕", idleImg:"dog2-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:95, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"cat1", fallbackEmoji:"🐱", idleImg:"cat1-emoji.png", walkImg:"cat-walk.gif", poseImg:"catpose.png", width:100, reverseFacing:false,
    walkImgLeft:"cat-walkImgLeft.gif", walkImgRight:"cat-walkImgRight.gif" },
  { id:"cat2", fallbackEmoji:"🐈", idleImg:"cat2-emoji.png", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", width:115, reverseFacing:false,
    walkImgLeft:"cat-walkImgLeft.gif", walkImgRight:"cat-walkImgRight.gif" }
];
// The animal thought bubble is now a single complete image
// (images/thought-bubble.png) with the message already drawn in, so
// there's no separate text/icon config needed here anymore.

const SPEED_PX_PER_SEC = 16;
const PETAL_COLORS = ["#ff4d6d","#ff85a1","#ffb3c6","#e63950","#ff6392","#ffd1dc"];
const PAW_COLORS = ["#ffffff","#ffd166","#ff8fc7","#7bdff2","#c77b4a","#b892ff"];

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

let editMode = false;
let zCounter = 20;
document.getElementById("editModeBtn").addEventListener("click", ()=>{
  editMode = !editMode;
  document.getElementById("editModeBtn").classList.toggle("active", editMode);
  const panel = document.getElementById("layoutPanel");
  panel.classList.toggle("show", editMode);
  if(editMode) panel.classList.remove("collapsed");   // start expanded each time you turn edit mode on
  document.querySelectorAll(".charCard").forEach(c => c.classList.toggle("editable", editMode));
  refreshLayoutOutput();
});
document.getElementById("layoutMinBtn").addEventListener("click", ()=>{
  const panel = document.getElementById("layoutPanel");
  const collapsing = !panel.classList.contains("collapsed");
  panel.classList.toggle("collapsed", collapsing);
  document.getElementById("layoutMinBtn").textContent = collapsing ? "➕" : "➖";
  document.getElementById("layoutMinBtn").title = collapsing ? "Show layout code" : "Minimize";
});
document.getElementById("copyLayoutBtn").addEventListener("click", ()=>{
  const text = document.getElementById("layoutOutput").textContent;
  navigator.clipboard?.writeText(text);
  const btn = document.getElementById("copyLayoutBtn");
  const original = btn.textContent;
  btn.textContent = "Copied!";
  setTimeout(()=>{ btn.textContent = original; }, 1200);
});
function refreshLayoutOutput(){
  const varName = IS_MOBILE_LAYOUT ? "LAYOUT_MOBILE" : "LAYOUT_DESKTOP";
  const lines = Object.keys(LAYOUT).map(key=>{
    const p = LAYOUT[key];
    return `${varName}["${key}"] = { x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)}, width: ${Math.round(p.width)}, z: ${p.z} };`;
  });
  document.getElementById("layoutOutput").textContent =
    `// Paste this UNDER the existing "const ${varName} = {...}" block in\n` +
    `// script.js — do NOT replace that block or delete it, just add these\n` +
    `// lines right after it. (Currently editing: screen is ${IS_MOBILE_LAYOUT ? "≤" : ">"} ${MOBILE_BREAKPOINT}px wide.)\n` +
    lines.join("\n");
}

function applyPosition(card, pos){
  card.style.left = pos.x + "%";
  card.style.top = pos.y + "%";
  card.style.width = `calc(var(--ui-scale) * ${pos.width}px)`;
  card.style.zIndex = pos.z;
}
function makeCard(c){
  const pos = LAYOUT[c.key];
  const card = document.createElement("div");
  card.className = "charCard char-" + c.key;
  card.innerHTML = `
    <img src="images/${c.img}" alt="${c.name}"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="charFallback" style="background:${c.color}">${c.name}</div>
    <div class="resizeHandle" aria-hidden="true">↕</div>`;
  applyPosition(card, pos);

  card.addEventListener("click", (e)=>{
    if(editMode){
      e.stopPropagation();
      zCounter++;
      pos.z = zCounter;
      card.style.zIndex = pos.z;
      refreshLayoutOutput();
      return;
    }
    openBalloon(c);
  });

  const resizeHandle = card.querySelector(".resizeHandle");
  resizeHandle.addEventListener("pointerdown", (e)=>{
    if(!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("dragging");
    const startX = e.clientX;
    const startWidth = pos.width;
    const onMove = (ev)=>{
      const delta = (ev.clientX - startX) * 0.12;
      pos.width = Math.max(60, startWidth + delta);
      card.style.width = `calc(var(--ui-scale) * ${pos.width}px)`;
      refreshLayoutOutput();
    };
    const onUp = ()=>{
      card.classList.remove("dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });

  card.addEventListener("pointerdown", (e)=>{
    if(!editMode || e.target === resizeHandle) return;
    e.preventDefault();
    card.classList.add("dragging");
    const layer = document.getElementById("charLayer");
    const rect = layer.getBoundingClientRect();
    const onMove = (ev)=>{
      let x = ((ev.clientX - rect.left) / rect.width) * 100;
      let y = ((ev.clientY - rect.top) / rect.height) * 100;
      pos.x = Math.max(0, Math.min(100, x));
      pos.y = Math.max(0, Math.min(100, y));
      card.style.left = pos.x + "%";
      card.style.top = pos.y + "%";
    };
    const onUp = ()=>{
      card.classList.remove("dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      refreshLayoutOutput();
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });

  card.addEventListener("wheel", (e)=>{
    if(!editMode) return;
    e.preventDefault();
    pos.width = Math.max(30, pos.width + (e.deltaY < 0 ? 8 : -8));
    card.style.width = `calc(var(--ui-scale) * ${pos.width}px)`;
    refreshLayoutOutput();
  }, { passive:false });

  return card;
}
function buildCharacters(){
  const layer = document.getElementById("charLayer");
  CHARACTERS.forEach(c => layer.appendChild(makeCard(c)));
}

const balloonOverlay = () => document.getElementById("balloonOverlay");
function openBalloon(c){
  const modal = document.getElementById("balloonModal");
  const msgEl = document.getElementById("balloonMsg");
  const knot = document.getElementById("balloonKnot");

  modal.style.background = c.color;
  modal.style.color = c.textColor || "#ffffff";
  knot.style.borderTopColor = c.color;
  msgEl.style.fontFamily = c.font || "'Segoe UI', 'Trebuchet MS', Arial, sans-serif";

  const iconFile = c.iconFile || (c.key + "-icon.png");
  const closeBtn = document.getElementById("balloonClose");
  closeBtn.style.color = c.textColor || "#ffffff";
  closeBtn.style.background = "rgba(255,255,255,.78)";
  closeBtn.style.border = "1px solid rgba(0,0,0,.12)";
  closeBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,.18)";
  msgEl.innerHTML =
    `<span class="nameLine">${c.name} ` +
    `<img class="inlineIcon" src="images/icons/${iconFile}" alt="${c.icon}" ` +
    `onerror="this.replaceWith(document.createTextNode('${c.icon}'));">:</span><br>${c.msg}`;

  balloonOverlay().classList.add("show");
  const maxSz = (IS_MOBILE_LAYOUT && c.balloonFontSizeMobile) || c.balloonFontSize || 1.35;
  const minSz = (IS_MOBILE_LAYOUT && c.balloonMinFontSizeMobile) || c.balloonMinFontSize || 0.72;
  fitBalloonText(msgEl, maxSz, minSz);
}
function closeBalloon(){ balloonOverlay().classList.remove("show"); }
document.getElementById("balloonClose").addEventListener("click", closeBalloon);
document.getElementById("balloonOverlay").addEventListener("click", (e)=>{
  if(e.target.id === "balloonOverlay") closeBalloon();
});
document.addEventListener("keydown", e=>{ if(e.key === "Escape") closeBalloon(); });

function fitBalloonText(el, preferredSize = 1.35, minSize = 0.72){
  const maxSize = Math.max(minSize, preferredSize);
  const lowerBound = Math.max(minSize, 0.5);
  el.style.fontSize = maxSize + "rem";
  el.style.lineHeight = maxSize >= 1.1 ? "1.2" : "1.28";
  if(el.scrollHeight <= el.clientHeight + 2){ return; }   // the max size already fits — done in one check

  let lo = lowerBound, hi = maxSize, best = lowerBound;
  for(let i = 0; i < 12; i++){   // binary search: ~12 checks covers the whole range precisely
    const mid = (lo + hi) / 2;
    el.style.fontSize = mid + "rem";
    if(el.scrollHeight <= el.clientHeight + 2){ best = mid; lo = mid; }
    else { hi = mid; }
  }
  el.style.fontSize = best + "rem";
  el.style.lineHeight = best >= 1.1 ? "1.2" : "1.28";
}

function setAnimalMode(body, a, mode, facing){
  const img = body.querySelector("img");
  let src;
  if(mode === "walk"){
    if(facing === -1 && a.walkImgLeft) src = a.walkImgLeft;
    else if(facing === 1 && a.walkImgRight) src = a.walkImgRight;
    else src = a.walkImg;
  } else if(mode === "pose"){
    src = a.poseImg;
  } else {
    src = a.idleImg;
  }
  const oldFallback = body.querySelector(".animalFallback");
  if(oldFallback) oldFallback.remove();
  if(src){
    img.style.display = "";
    img.onerror = () => {
      img.style.display = "none";
      const fb = document.createElement("span");
      fb.className = "animalFallback";
      fb.textContent = a.fallbackEmoji;
      body.insertBefore(fb, body.firstChild);
    };
    img.src = "images/" + src;
  } else {
    img.style.display = "none";
    const fb = document.createElement("span");
    fb.className = "animalFallback";
    fb.textContent = a.fallbackEmoji;
    body.insertBefore(fb, body.firstChild);
  }
}
function applyAnimalSize(body, a){
  body.style.width = `calc(var(--ui-scale) * ${a.width}px)`;
  body.style.fontSize = `calc(var(--ui-scale) * ${Math.round(a.width * 0.85)}px)`;
}
function buildAnimals(){
  const grass = document.getElementById("grass");
  const sharedBubble = document.getElementById("animalBubble");
  ANIMALS.forEach((a,i)=>{
    const el = document.createElement("div");
    el.className = "animal";
    el.style.left = (10 + i*22) + "%";
    el.innerHTML = `<div class="animalBody"><img alt="${a.fallbackEmoji}"></div>`;
    grass.appendChild(el);
    const body = el.querySelector(".animalBody");
    applyAnimalSize(body, a);
    setAnimalMode(body, a, "idle");
    animateWalk(el, body, a);
    el.addEventListener("click", ()=>{
      if(body.classList.contains("posing")) return;

      // Freeze the animal exactly where it is RIGHT NOW — without this,
      // a click mid-walk would only visually stop once the in-progress
      // CSS transition finished gliding to its target.
      const frozenLeft = getComputedStyle(el).left;
      el.style.transition = "none";
      el.style.left = frozenLeft;
      void el.offsetWidth;   // force the browser to apply the freeze before continuing

      body.classList.add("posing");
      setAnimalMode(body, a, "pose");

      // Anchor to the animal's OWN current position — reliable now that
      // its size is fully controlled by "width" above, so it stays
      // close to its head no matter how you've resized the grass.
      const rect = body.getBoundingClientRect();
      sharedBubble.style.left = (rect.left + rect.width/2) + "px";
      sharedBubble.style.top = (rect.top - 8) + "px";
      sharedBubble.classList.add("show");

      setTimeout(()=>{
        body.classList.remove("posing");
        sharedBubble.classList.remove("show");
        setAnimalMode(body, a, "idle");
      }, 2200);
    });
  });
}
function animateWalk(el, body, a){
  function step(){
    if(body.classList.contains("posing")){ setTimeout(step, 400); return; }
    const grassW = document.getElementById("grass").clientWidth;
    const curLeftPx = el.offsetLeft;
    const target = Math.random()*(grassW-70);
    const distance = Math.abs(target - curLeftPx);
    const dur = Math.max(3000, Math.min(9000, (distance / SPEED_PX_PER_SEC) * 1000));
    let facing = target < curLeftPx ? -1 : 1;
    if(a.reverseFacing) facing *= -1;

    const usingDirectionalGif = (facing === -1 && a.walkImgLeft) || (facing === 1 && a.walkImgRight);

    setAnimalMode(body, a, "walk", facing);
    el.style.transition = `left ${dur}ms linear`;
    el.style.left = target + "px";
    body.style.transform = usingDirectionalGif
      ? ``
      : `scaleX(${facing})`;

    dropPaws(el, a, dur);
    setTimeout(()=>{
      if(!body.classList.contains("posing")) setAnimalMode(body, a, "idle");
      setTimeout(step, 800 + Math.random()*2200);
    }, dur);
  }
  step();
}

function pawSVG(color){
  return `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="42" rx="17" ry="15" fill="${color}"/>
    <circle cx="13" cy="21" r="8" fill="${color}"/>
    <circle cx="28" cy="9"  r="8" fill="${color}"/>
    <circle cx="43" cy="9"  r="8" fill="${color}"/>
    <circle cx="55" cy="21" r="8" fill="${color}"/>
  </svg>`;
}
function dropPaws(el, a, duration){
  const grass = document.getElementById("grass");
  const count = 5;
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const paw = document.createElement("div");
      paw.className = "pawprint";
      const size = 16 + Math.random()*26;
      paw.style.width = size + "px";
      paw.style.height = size + "px";
      paw.style.opacity = 0.95;
      paw.innerHTML = pawSVG(PAW_COLORS[Math.floor(Math.random()*PAW_COLORS.length)]);
      paw.style.left = (el.offsetLeft + (Math.random()*20-10)) + "px";
      paw.style.bottom = (6 + Math.random()*10) + "%";
      grass.appendChild(paw);
      setTimeout(()=>paw.remove(), 8200);
    }, (duration/count)*i);
  }
}

function buildStars(){
  const site = document.getElementById("site");
  for(let i=0;i<100;i++){
    const s = document.createElement("div");
    s.className = "star";
    const size = 1 + Math.random()*1.6;
    s.style.width = size+"px";
    s.style.height = size+"px";
    s.style.left = Math.random()*100+"%";
    s.style.top = Math.random()*100+"%";
    s.style.animationDuration = (2+Math.random()*3.5)+"s";
    s.style.animationDelay = (Math.random()*4)+"s";
    site.appendChild(s);
  }
}
function buildRain(){
  const site = document.getElementById("site");
  for(let i=0;i<40;i++){
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = Math.random()*100+"%";
    d.style.animationDuration = (0.6+Math.random()*0.7)+"s";
    d.style.animationDelay = (Math.random()*2)+"s";
    d.style.opacity = (0.2+Math.random()*0.4);
    site.appendChild(d);
  }
}
function buildFireflies(){
  const site = document.getElementById("site");
  for(let i=0;i<16;i++){
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.left = Math.random()*100+"%";
    f.style.top = (10+Math.random()*80)+"%";
    f.style.animationDelay = (Math.random()*4)+"s, "+(Math.random()*10)+"s";
    site.appendChild(f);
  }
}
function buildSakura(){
  const site = document.getElementById("site");
  setInterval(()=>{
    const p = document.createElement("div");
    p.className = "petal";
    const size = 6 + Math.random()*14;
    p.style.width = size+"px";
    p.style.height = size+"px";
    p.style.left = Math.random()*100+"%";
    p.style.background = PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    const dur = 8+Math.random()*8;
    p.style.animationDuration = dur+"s";
    site.appendChild(p);
    setTimeout(()=>p.remove(), dur*1000+500);
  }, 500);
}

function initMusic(){
  const audio = document.getElementById("bgMusic");
  audio.src = "audio/" + MUSIC_FILE;
  document.getElementById("musicBtn").addEventListener("click", ()=>{
    const btn = document.getElementById("musicBtn");
    if(audio.paused) attemptAutoplay();
    else { audio.pause(); btn.classList.remove("playing"); btn.textContent="🎵"; }
  });
}
function attemptAutoplay(){
  const btn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  audio.play().then(()=>{
    btn.classList.add("playing"); btn.textContent="🔊";
  }).catch(()=>{
    const original = btn.textContent;
    btn.textContent = "⚠️";
    setTimeout(()=>{ btn.textContent = original; }, 1500);
  });
}

/* ---------- shooting star ----------
   One appears 25 seconds after the password is entered, then every 25
   seconds after that. Appended directly to <body> (not #site) with
   z-index:300 in styles.css, so it always renders above everything. */
function spawnShootingStar(){
  const star = document.createElement("div");
  star.className = "shootingStar";

  const startX = 5 + Math.random()*55;
  const startY = 4 + Math.random()*30;
  const angle  = 16 + Math.random()*26;
  const distance = 55 + Math.random()*30;
  const dur = 1000 + Math.random()*1000;

  star.style.left = startX + "vw";
  star.style.top = startY + "vh";

  document.body.appendChild(star);

  star.animate(
    [
      { transform:`rotate(${angle}deg) translateX(0)`, opacity:0 },
      { transform:`rotate(${angle}deg) translateX(8vw)`, opacity:1, offset:0.12 },
      { transform:`rotate(${angle}deg) translateX(${distance}vw)`, opacity:0 }
    ],
    { duration:dur, easing:"linear", fill:"forwards" }
  );

  setTimeout(()=> star.remove(), dur + 50);
}
function initShootingStars(){
  spawnShootingStar();
  setInterval(spawnShootingStar, 25000);
}

function initSite(){
  buildCharacters();
  buildAnimals();
  buildStars();
  buildRain();
  buildFireflies();
  buildSakura();
  initMusic();
  attemptAutoplay();
  initShootingStars();
}