/* ======================================================================
   MOBILE-ONLY SCRIPT. Desktop has its own separate script.js — editing
   this file never affects the desktop layout, and vice versa.
   Character messages/colors/fonts live in characters-data.js (shared).
   ====================================================================== */

const SITE_PASSWORD = "CellsAtWork";

/* The ✕ starts out (in the shared index.html markup) as a child of
   #balloonModal, which desktop still relies on. But #balloonModal has
   overflow:hidden to clip long text to the round shape, and that was
   also clipping the button whenever it sat outside the circle's curve.
   Moving it to be a sibling inside #balloonFloatWrap instead — done
   here, mobile-only — lets it float as its own badge above the edge of
   the circle without touching the shared HTML or desktop's CSS/JS. */
(function relocateCloseButtonOutsideCircle(){
  const modal = document.getElementById("balloonModal");
  const wrap = document.getElementById("balloonFloatWrap");
  const closeBtn = document.getElementById("balloonClose");
  if(modal && wrap && closeBtn && closeBtn.parentElement === modal){
    wrap.insertBefore(closeBtn, modal.nextSibling);
  }
})();
const MUSIC_FILE = "birthday-ost.mp3";

const LAYOUT_MOBILE = {
  "yukari": { x: 80.5, y: 22.5, width: 309, z: 22 },
  "kurumu": { x: 18.5, y: 21.0, width: 278, z: 23 },
  "mizore": { x: 62.9, y: 28.2, width: 257, z: 24 },
  "tsukune": { x: 40.0, y: 26.7, width: 240, z: 25 },
  "moka-inner": { x: 17.9, y: 50.8, width: 363, z: 26 },
  "moka-outer": { x: 81.7, y: 50.2, width: 220, z: 23 },
  "winnie-pooh": { x: 81.8, y: 82.5, width: 235, z: 46 },
  "bubu-dudu": { x: 69.9, y: 69.5, width: 284, z: 50 },
  "hellokitty": { x: 51.5, y: 83.3, width: 346, z: 43 },
  "captain-ri-seri": { x: 37.7, y: 69.2, width: 281, z: 39 },
  "jollibee": { x: 18.7, y: 82.8, width: 311, z: 47 },
};
const LAYOUT = LAYOUT_MOBILE;

// Position of the "Happy Birthday!" title, same idea as LAYOUT_MOBILE
// above: x/y are the center of the title as a % of the screen. Edit
// these numbers directly, OR use 🖐️ edit mode and drag the title —
// dragging updates this value live and "Copy layout code" includes it.
const TITLE_MOBILE = { x: 50, y: 54 };

// Fallback only — every character in characters-data.js has its own
// balloonFontSizeMobile now, this is just a safety net if one is missing.
const MOBILE_BALLOON_FALLBACK_FONT_REM = 1.2;

const ANIMALS = [
  { id:"dog1", fallbackEmoji:"🐶", idleImg:"dog1-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:110, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"dog2", fallbackEmoji:"🐕", idleImg:"dog2-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:95, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"cat1", fallbackEmoji:"🐱", idleImg:"cat-emoji.gif", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", width:100, reverseFacing:false,
    walkImgLeft:"cat-walkImgLeft.gif", walkImgRight:"cat-walkImgRight.gif" },
  { id:"cat2", fallbackEmoji:"🐈", idleImg:"cat-emoji.gif", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", width:115, reverseFacing:false,
    walkImgLeft:"cat-walkImgLeft.gif", walkImgRight:"cat-walkImgRight.gif" }
];

const SPEED_PX_PER_SEC = 16;
const PETAL_COLORS = ["#ff4d6d","#ff85a1","#ffb3c6","#e63950","#ff6392","#ffd1dc"];
const PAW_COLORS = ["#ffffff","#ffd166","#ff8fc7","#7bdff2","#c77b4a","#b892ff"];

document.getElementById("unlockBtn").addEventListener("click", tryUnlock);
document.getElementById("pwInput").addEventListener("keydown", e => { if(e.key === "Enter") tryUnlock(); });

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
  if(editMode) panel.classList.remove("collapsed");
  document.querySelectorAll(".charCard").forEach(c => c.classList.toggle("editable", editMode));
  document.getElementById("hbTitle").classList.toggle("editable", editMode);
  refreshLayoutOutput();
});

document.getElementById("layoutMinBtn").addEventListener("click", ()=>{
  const panel = document.getElementById("layoutPanel");
  const collapsing = !panel.classList.contains("collapsed");
  panel.classList.toggle("collapsed", collapsing);
  document.getElementById("layoutMinBtn").textContent = collapsing ? "➕" : "➖";
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
  const lines = Object.keys(LAYOUT).map(key=>{
    const p = LAYOUT[key];
    return `  "${key}": { x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)}, width: ${Math.round(p.width)}, z: ${p.z} },`;
  });
  document.getElementById("layoutOutput").textContent =
`// Replace the body of the existing "const LAYOUT_MOBILE = {...}" object
// in script-mobile.js with these lines.
const LAYOUT_MOBILE = {
${lines.join("\n")}
};

// Replace the existing "const TITLE_MOBILE = {...}" line with this one.
const TITLE_MOBILE = { x: ${TITLE_MOBILE.x.toFixed(1)}, y: ${TITLE_MOBILE.y.toFixed(1)} };`;
}

/* ---------- draggable "Happy Birthday!" title (edit mode only) ----------
   Applies TITLE_MOBILE on load. Dragging in edit mode updates that same
   object live and refreshes the copyable code in the Layout Editor panel
   — same pattern as the characters, so there's one consistent place
   (script-mobile.js) to find and hand-edit every coordinate on the site. */
function applyTitlePosition(){
  const title = document.getElementById("hbTitle");
  title.style.left = TITLE_MOBILE.x + "%";
  title.style.top = TITLE_MOBILE.y + "%";
}

function initDraggableTitle(){
  const title = document.getElementById("hbTitle");
  applyTitlePosition();

  title.addEventListener("pointerdown", e=>{
    if(!editMode) return;
    e.preventDefault();
    title.classList.add("dragging");
    const onMove = ev=>{
      const x = Math.max(0, Math.min(100, (ev.clientX / window.innerWidth) * 100));
      const y = Math.max(0, Math.min(100, (ev.clientY / window.innerHeight) * 100));
      TITLE_MOBILE.x = x;
      TITLE_MOBILE.y = y;
      title.style.left = x + "%";
      title.style.top = y + "%";
    };
    const onUp = ()=>{
      title.classList.remove("dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      refreshLayoutOutput();
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
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

  card.addEventListener("click", e=>{
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

  resizeHandle.addEventListener("pointerdown", e=>{
    if(!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("dragging");
    const startX = e.clientX;
    const startWidth = pos.width;
    const onMove = ev=>{
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

  card.addEventListener("pointerdown", e=>{
    if(!editMode || e.target === resizeHandle) return;
    e.preventDefault();
    card.classList.add("dragging");
    const layer = document.getElementById("charLayer");
    const rect = layer.getBoundingClientRect();
    const onMove = ev=>{
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

  card.addEventListener("wheel", e=>{
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

function balloonOverlay(){
  return document.getElementById("balloonOverlay");
}

/* Balloon sizing is now fully manual: the balloon is a fixed size/shape
   (set in styles-mobile.css) for every character, and each character's
   balloonFontSizeMobile (characters-data.js) is applied exactly as
   given — nothing measures, shrinks, or grows automatically. If a
   message doesn't fit, that character's number is what to change. */
function openBalloon(c){
  const modal = document.getElementById("balloonModal");
  const msgEl = document.getElementById("balloonMsg");
  const knot = document.getElementById("balloonKnot");

  modal.style.background = c.color;
  modal.style.color = c.textColor || "#ffffff";
  knot.style.borderTopColor = c.color;
  msgEl.style.fontFamily = c.font || "'Segoe UI', 'Trebuchet MS', Arial, sans-serif";

  const iconFile = c.iconFile || (c.key + "-icon.png");
  msgEl.innerHTML =
    `<span class="nameLine">${c.name} ` +
    `<img class="inlineIcon" src="images/icons/${iconFile}" alt="${c.icon}" ` +
    `onerror="this.replaceWith(document.createTextNode('${c.icon}'));">:</span><br>${c.msg}`;

  const fontRem = c.balloonFontSizeMobile || MOBILE_BALLOON_FALLBACK_FONT_REM;
  msgEl.style.fontSize = fontRem + "rem";
  msgEl.style.lineHeight = fontRem >= 1.1 ? "1.2" : "1.28";

  balloonOverlay().classList.add("show");
}

function closeBalloon(){
  balloonOverlay().classList.remove("show");
}

document.getElementById("balloonClose").addEventListener("click", closeBalloon);
document.getElementById("balloonOverlay").addEventListener("click", e=>{
  if(e.target.id === "balloonOverlay") closeBalloon();
});
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") closeBalloon();
});

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

function pawSVG(color){
  return `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="42" rx="17" ry="15" fill="${color}"/>
    <circle cx="13" cy="21" r="8" fill="${color}"/>
    <circle cx="28" cy="9"  r="8" fill="${color}"/>
    <circle cx="43" cy="9"  r="8" fill="${color}"/>
    <circle cx="55" cy="21" r="8" fill="${color}"/>
  </svg>`;
}

function dropPaws(el, duration){
  const grass = document.getElementById("grass");
  const count = 5;
  for(let i = 0; i < count; i++){
    setTimeout(()=>{
      const paw = document.createElement("div");
      paw.className = "pawprint";
      const size = 16 + Math.random() * 26;
      paw.style.width = size + "px";
      paw.style.height = size + "px";
      paw.style.opacity = 0.95;
      paw.innerHTML = pawSVG(PAW_COLORS[Math.floor(Math.random() * PAW_COLORS.length)]);
      paw.style.left = (el.offsetLeft + (Math.random() * 20 - 10)) + "px";
      paw.style.bottom = (6 + Math.random() * 10) + "%";
      grass.appendChild(paw);
      setTimeout(()=>paw.remove(), 8200);
    }, (duration / count) * i);
  }
}

function animateWalk(el, body, a){
  function step(){
    if(body.classList.contains("posing")){
      setTimeout(step, 400);
      return;
    }

    const grassW = document.getElementById("grass").clientWidth;
    const curLeftPx = el.offsetLeft;
    const target = Math.random() * (grassW - 70);
    const distance = Math.abs(target - curLeftPx);
    const dur = Math.max(3000, Math.min(9000, (distance / SPEED_PX_PER_SEC) * 1000));
    let facing = target < curLeftPx ? -1 : 1;
    if(a.reverseFacing) facing *= -1;

    const usingDirectionalGif = (facing === -1 && a.walkImgLeft) || (facing === 1 && a.walkImgRight);

    setAnimalMode(body, a, "walk", facing);
    el.style.transition = `left ${dur}ms linear`;
    el.style.left = target + "px";
    body.style.transform = usingDirectionalGif ? "" : `scaleX(${facing})`;

    dropPaws(el, dur);

    setTimeout(()=>{
      if(!body.classList.contains("posing")) setAnimalMode(body, a, "idle");
      setTimeout(step, 800 + Math.random() * 2200);
    }, dur);
  }
  step();
}

/* Clamp the shared speech bubble so it never renders partly off-screen
   for animals walking near the left/right/top edges. */
function positionAnimalBubble(bubble, rect){
  const margin = 12;
  const bw = bubble.offsetWidth || 220;
  const bh = bubble.offsetHeight || 140;
  let left = rect.left + rect.width / 2;
  let top = rect.top - 8;
  left = Math.min(window.innerWidth - margin - bw / 2, Math.max(margin + bw / 2, left));
  top = Math.max(margin + bh, top);
  bubble.style.left = left + "px";
  bubble.style.top = top + "px";
}

/* The bubble is just the thought-bubble.png image — "Happy Birthday,
   Liam!" is baked into that image already, so there's no text to build
   or fit here. Still worth its own function so triggerPose stays tidy
   and it's easy to swap the graphic later if needed. */
function buildAnimalBubbleHTML(){
  return `<img class="animalBubbleImg" src="images/thought-bubble.png" alt="Happy Birthday, Liam!" loading="eager">`;
}

function triggerPose(el, body, a, sharedBubble){
  if(body.classList.contains("posing")) return;

  // freeze the animal's current on-screen position and cancel any
  // in-flight "left" transition before switching to the pose sprite
  const frozenLeft = getComputedStyle(el).left;
  el.style.transition = "none";
  el.style.left = frozenLeft;
  void el.offsetWidth;

  body.classList.add("posing");
  setAnimalMode(body, a, "pose");

  sharedBubble.innerHTML = buildAnimalBubbleHTML();
  const rect = body.getBoundingClientRect();
  positionAnimalBubble(sharedBubble, rect);
  sharedBubble.classList.remove("hide");
  sharedBubble.classList.add("show");

  setTimeout(()=>{
    body.classList.remove("posing");
    sharedBubble.classList.remove("show");
    sharedBubble.classList.add("hide");
    setAnimalMode(body, a, "idle");
  }, 2200);
}

function buildAnimals(){
  const grass = document.getElementById("grass");
  const sharedBubble = document.getElementById("animalBubble");
  ANIMALS.forEach((a, i)=>{
    const el = document.createElement("div");
    el.className = "animal";
    el.style.left = (10 + i * 22) + "%";
    el.innerHTML = `<div class="animalBody"><img alt="${a.fallbackEmoji}"></div>`;
    grass.appendChild(el);

    const body = el.querySelector(".animalBody");
    applyAnimalSize(body, a);
    setAnimalMode(body, a, "idle");
    animateWalk(el, body, a);

    // pointerdown instead of click: while the animal is mid-walk its
    // "left" is CSS-transitioning, so by the time a click would fire
    // (after touchend) the element can have already slid out from
    // under the finger, and some mobile browsers then drop the click.
    // pointerdown fires the instant the finger lands, before that can
    // happen — this is what was causing "sometimes doesn't pose".
    el.addEventListener("pointerdown", (e)=>{
      e.preventDefault();
      triggerPose(el, body, a, sharedBubble);
    });
  });
}

function buildStars(){
  const site = document.getElementById("site");
  for(let i = 0; i < 60; i++){
    const s = document.createElement("div");
    s.className = "star";
    const size = 1 + Math.random() * 1.4;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDuration = (2 + Math.random() * 3.5) + "s";
    s.style.animationDelay = (Math.random() * 4) + "s";
    site.appendChild(s);
  }
}

function buildRain(){
  const site = document.getElementById("site");
  for(let i = 0; i < 20; i++){
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = Math.random() * 100 + "%";
    d.style.animationDuration = (0.8 + Math.random() * 0.8) + "s";
    d.style.animationDelay = (Math.random() * 2) + "s";
    d.style.opacity = (0.2 + Math.random() * 0.3);
    site.appendChild(d);
  }
}

function buildFireflies(){
  const site = document.getElementById("site");
  for(let i = 0; i < 8; i++){
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.left = Math.random() * 100 + "%";
    f.style.top = (10 + Math.random() * 80) + "%";
    f.style.animationDelay = (Math.random() * 4) + "s, " + (Math.random() * 10) + "s";
    site.appendChild(f);
  }
}

function buildSakura(){
  const site = document.getElementById("site");
  setInterval(()=>{
    const p = document.createElement("div");
    p.className = "petal";
    const size = 6 + Math.random() * 10;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    const dur = 10 + Math.random() * 6;
    p.style.animationDuration = dur + "s";
    site.appendChild(p);
    setTimeout(()=>p.remove(), dur * 1000 + 500);
  }, 900);
}

function initMusic(){
  const audio = document.getElementById("bgMusic");
  audio.src = "audio/" + MUSIC_FILE;
  document.getElementById("musicBtn").addEventListener("click", ()=>{
    const btn = document.getElementById("musicBtn");
    if(audio.paused) attemptAutoplay();
    else {
      audio.pause();
      btn.classList.remove("playing");
      btn.textContent = "🎵";
    }
  });
}

function attemptAutoplay(){
  const btn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  audio.play().then(()=>{
    btn.classList.add("playing");
    btn.textContent = "🔊";
  }).catch(()=>{
    const original = btn.textContent;
    btn.textContent = "⚠️";
    setTimeout(()=>{ btn.textContent = original; }, 1500);
  });
}

function spawnShootingStar(){
  const star = document.createElement("div");
  star.className = "shootingStar";
  const startX = 5 + Math.random() * 55;
  const startY = 4 + Math.random() * 30;
  const angle  = 16 + Math.random() * 26;
  const distance = 55 + Math.random() * 30;
  const dur = 1000 + Math.random() * 1000;
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
  initDraggableTitle();
  refreshLayoutOutput();
}