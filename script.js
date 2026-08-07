/* ======================================================================
   DESKTOP-ONLY SCRIPT. Mobile has its own separate script-mobile.js —
   editing this file never affects the mobile layout, and vice versa.
   Character messages/colors/fonts live in characters-data.js (shared).
   ====================================================================== */

const SITE_PASSWORD = "CellsAtWork";
const MUSIC_FILE = "birthday-ost.mp3";

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
const LAYOUT = LAYOUT_DESKTOP;

const ANIMALS = [
  { id:"dog1", fallbackEmoji:"🐶", idleImg:"dog1-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:110, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"dog2", fallbackEmoji:"🐕", idleImg:"dog2-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:95, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"cat1", fallbackEmoji:"🐱", idleImg:"cat-emoji.gif", walkImg:"cat-walk.gif", poseImg:"catpose.png", width:100, reverseFacing:false,
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
`// Replace the body of the existing "const LAYOUT_DESKTOP = {...}" object
// in script.js with these lines.
const LAYOUT_DESKTOP = {
${lines.join("\n")}
};`;
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

function fitBalloonText(el, preferredSize = 1.35, minSize = 0.72){
  const maxSize = Math.max(minSize, preferredSize);
  const lowerBound = Math.max(minSize, 0.5);
  el.style.fontSize = maxSize + "rem";
  el.style.lineHeight = maxSize >= 1.1 ? "1.2" : "1.28";
  if(el.scrollHeight <= el.clientHeight + 2) return;

  let lo = lowerBound, hi = maxSize, best = lowerBound;
  for(let i = 0; i < 12; i++){
    const mid = (lo + hi) / 2;
    el.style.fontSize = mid + "rem";
    if(el.scrollHeight <= el.clientHeight + 2){ best = mid; lo = mid; }
    else hi = mid;
  }
  el.style.fontSize = best + "rem";
  el.style.lineHeight = best >= 1.1 ? "1.2" : "1.28";
}

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
  fitBalloonText(msgEl, c.balloonFontSize || 1.35, c.balloonMinFontSize || 0.72);
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

/* Builds the cloud bubble's inner markup (cloud graphic + message +
   optional icon + tail) from the shared ANIMAL_BUBBLE_MESSAGES data. */
function buildAnimalBubbleHTML(){
  const bubbleMsg = (typeof ANIMAL_BUBBLE_MESSAGES !== "undefined" && ANIMAL_BUBBLE_MESSAGES[0])
    || { text: (typeof ANIMAL_BUBBLE_FALLBACK_TEXT !== "undefined" ? ANIMAL_BUBBLE_FALLBACK_TEXT : "Happy Birthday!") };
  const bubbleIcon = bubbleMsg.icon || "";
  const bubbleIconFile = bubbleMsg.iconFile ? `images/icons/${bubbleMsg.iconFile}` : "";
  let html =
    `<img class="animalBubbleCloud" src="images/icons/cloud-bubble.png" alt="" loading="eager">` +
    `<span class="animalBubbleContent">` +
    `<span class="animalBubbleText">${bubbleMsg.text}</span>`;
  if(bubbleIconFile){
    html += `<img class="inlineIcon animalBubbleIcon" src="${bubbleIconFile}" alt="${bubbleIcon}" ` +
      `onerror="this.replaceWith(document.createTextNode('${bubbleIcon}'));">`;
  }
  html += `</span><span class="bubbleTail"></span>`;
  return html;
}

function fitAnimalBubbleText(bubble){
  const width = bubble.offsetWidth || 300;
  const text = bubble.querySelector(".animalBubbleText");
  if(!text) return;
  const charCount = text.textContent.replace(/\s+/g, " ").trim().length;
  const sizeScale = charCount > 24 ? 0.92 : 1;
  const baseSize = Math.max(0.9, Math.min(1.24, width / 11) * sizeScale);
  bubble.style.fontSize = baseSize.toFixed(2) + "rem";
  bubble.style.lineHeight = "1.2";
}

/* Rotates + resizes the little tail so it always points from the bubble
   toward the animal that opened it, however the bubble ends up placed. */
function pointBubbleTail(bubble, animalRect){
  const tail = bubble.querySelector(".bubbleTail");
  if(!tail) return;
  const bubbleRect = bubble.getBoundingClientRect();
  const tailOriginX = bubbleRect.left + bubbleRect.width * 0.5;
  const tailOriginY = bubbleRect.top + bubbleRect.height;
  const targetX = animalRect.left + animalRect.width / 2;
  const targetY = animalRect.top + animalRect.height / 2;
  const dx = targetX - tailOriginX;
  const dy = targetY - tailOriginY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
  const distance = Math.hypot(dx, dy);
  const newHeight = Math.min(Math.max(16, distance * 0.4), 80);
  tail.style.height = newHeight + "px";
  tail.style.transform = `translateX(-50%) rotate(${angle}deg)`;
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

    el.addEventListener("click", ()=>{
      if(body.classList.contains("posing")) return;

      const frozenLeft = getComputedStyle(el).left;
      el.style.transition = "none";
      el.style.left = frozenLeft;
      void el.offsetWidth;

      body.classList.add("posing");
      setAnimalMode(body, a, "pose");

      sharedBubble.innerHTML = buildAnimalBubbleHTML();
      const rect = body.getBoundingClientRect();
      sharedBubble.style.left = (rect.left + rect.width / 2) + "px";
      sharedBubble.style.top = (rect.top - 8) + "px";
      sharedBubble.classList.remove("hide");
      sharedBubble.classList.add("show");

      requestAnimationFrame(()=>{
        fitAnimalBubbleText(sharedBubble);
        pointBubbleTail(sharedBubble, rect);
      });

      setTimeout(()=>{
        body.classList.remove("posing");
        sharedBubble.classList.remove("show");
        sharedBubble.classList.add("hide");
        setAnimalMode(body, a, "idle");
      }, 2200);
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
  refreshLayoutOutput();
}