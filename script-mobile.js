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
  "mizore": { x: 62.3, y: 25.1, width: 257, z: 24 },
  "tsukune": { x: 41.6, y: 24.6, width: 240, z: 25 },
  "moka-inner": { x: 13.4, y: 51.3, width: 363, z: 26 },
  "moka-outer": { x: 86.3, y: 51.0, width: 229, z: 23 },
  "winnie-pooh": { x: 81.8, y: 82.5, width: 235, z: 46 },
  "bubu-dudu": { x: 65.0, y: 69.0, width: 284, z: 50 },
  "hellokitty": { x: 51.5, y: 83.3, width: 346, z: 43 },
  "captain-ri-seri": { x: 32.7, y: 68.7, width: 281, z: 39 },
  "jollibee": { x: 18.7, y: 82.8, width: 311, z: 47 },
};
const LAYOUT = LAYOUT_MOBILE;

// Position AND size of the "Happy Birthday!" title, same idea as
// LAYOUT_MOBILE above: x/y are the center as a % of the screen, width is
// in px (same reference scale as character widths). Edit these numbers
// directly, OR use 🖐️ edit mode — the title can now be both dragged AND
// scroll-resized just like a character, and "Copy layout code" includes
// its current position + size.
const TITLE_MOBILE = { x: 52.0, y: 50.5, width: 568 };

// Fallback only — every character in characters-data.js has its own
// balloonFontSizeMobile now, this is just a safety net if one is missing.
const MOBILE_BALLOON_FALLBACK_FONT_REM = 1.2;

const ANIMALS = [
  { id:"dog1", fallbackEmoji:"🐶", idleImg:"dog1-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:110, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"dog2", fallbackEmoji:"🐕", idleImg:"dog2-emoji.png", walkImg:"dog-walk.gif", poseImg:"dogpose.gif", width:95, reverseFacing:false,
    walkImgLeft:"dog-walkImgLeft.gif", walkImgRight:"dog-walkImgRight.gif" },
  { id:"cat1", fallbackEmoji:"🐱", idleImg:"cat1-emoji.png", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", width:100, reverseFacing:false,
    walkImgLeft:"cat-walkImgLeft.gif", walkImgRight:"cat-walkImgRight.gif" },
  { id:"cat2", fallbackEmoji:"🐈", idleImg:"cat2-emoji.png", walkImg:"cat-walk.gif", poseImg:"cat-pose.gif", width:115, reverseFacing:false,
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
const TITLE_MOBILE = { x: ${TITLE_MOBILE.x.toFixed(1)}, y: ${TITLE_MOBILE.y.toFixed(1)}, width: ${Math.round(TITLE_MOBILE.width)} };`;
}

/* ---------- draggable + resizable "Happy Birthday!" title (edit mode only) ----------
   Applies TITLE_MOBILE on load. In edit mode: drag to move, drag the
   handle to resize — same pattern as the characters/moon, so there's one
   consistent place (script-mobile.js) to find and hand-edit every
   coordinate and size on the site.

   The handle is a separate fixed-position element (not nested inside
   #hbTitle) tracked via getBoundingClientRect(), same approach as the
   moon's handle on desktop — nesting it inside the title trapped it in
   the title's own stacking context, so no z-index on the handle could
   ever beat sibling UI like the Layout Editor panel, which was silently
   eating every tap on it. */
function positionTitleResizeHandle(){
  const title = document.getElementById("hbTitle");
  const handle = document.getElementById("titleResizeHandle");
  const rect = title.getBoundingClientRect();
  handle.style.left = (rect.right - 12) + "px";
  handle.style.top = (rect.bottom - 12) + "px";
}

function applyTitlePosition(){
  const title = document.getElementById("hbTitle");
  title.style.left = TITLE_MOBILE.x + "%";
  title.style.top = TITLE_MOBILE.y + "%";
  title.style.width = `calc(var(--ui-scale) * ${TITLE_MOBILE.width}px)`;
  positionTitleResizeHandle();
}

function initDraggableTitle(){
  const title = document.getElementById("hbTitle");
  const resizeHandle = document.getElementById("titleResizeHandle");
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
      positionTitleResizeHandle();
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

  // Touch-friendly resize handle — "wheel" (mouse scroll) doesn't exist
  // as a gesture on a touchscreen, which is why resizing wasn't working
  // on mobile originally. Drag this handle instead, same as characters.
  resizeHandle.addEventListener("pointerdown", e=>{
    if(!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    title.classList.add("dragging");
    const startX = e.clientX;
    const startWidth = TITLE_MOBILE.width;
    const onMove = ev=>{
      const delta = (ev.clientX - startX) * 0.5;
      TITLE_MOBILE.width = Math.max(120, startWidth + delta);
      title.style.width = `calc(var(--ui-scale) * ${TITLE_MOBILE.width}px)`;
      positionTitleResizeHandle();
      refreshLayoutOutput();
    };
    const onUp = ()=>{
      title.classList.remove("dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });

  window.addEventListener("resize", positionTitleResizeHandle);
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
  msgEl.style.lineHeight = fontRem >= 1.1 ? "1.15" : "1.2";

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

/* Picks a walk target that keeps some distance from every OTHER animal's
   current position. Without this, two animals can end up right on top
   of each other — and since they share the same z-index, a tap in that
   spot lands on whichever one happens to be later in the DOM/stacking
   order, not necessarily the one that was visually tapped. That's what
   was causing the thought-bubble to appear next to the wrong animal. */
const ANIMAL_MIN_GAP_PX = 90;
function pickWalkTarget(grassW, el){
  const maxX = grassW - 70;
  const others = Array.from(document.querySelectorAll(".animal")).filter(o => o !== el);
  for(let attempt = 0; attempt < 12; attempt++){
    const candidate = Math.random() * maxX;
    const tooClose = others.some(o => Math.abs(o.offsetLeft - candidate) < ANIMAL_MIN_GAP_PX);
    if(!tooClose) return candidate;
  }
  return Math.random() * maxX; // couldn't find a clear spot — just go, better than freezing forever
}

function animateWalk(el, body, a){
  function step(){
    if(body.classList.contains("posing")){
      setTimeout(step, 400);
      return;
    }

    const grassW = document.getElementById("grass").clientWidth;
    const curLeftPx = el.offsetLeft;
    const target = pickWalkTarget(grassW, el);
    const distance = Math.abs(target - curLeftPx);
    const dur = Math.max(3000, Math.min(9000, (distance / SPEED_PX_PER_SEC) * 1000));
    let facing = target < curLeftPx ? -1 : 1;
    if(a.reverseFacing) facing *= -1;
    el.dataset.facing = facing; // remembered for the thought-bubble direction on tap

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

/* Positions the bubble AHEAD of the animal in whichever direction it's
   facing (not centered on top of it) — a cat walking right gets its
   bubble out in front to the right, not straddling/behind where it's
   already passed. Still clamped so it never renders off-screen. */
function positionAnimalBubble(bubble, rect, facing){
  const margin = 12;
  const bw = bubble.offsetWidth || 220;
  const bh = bubble.offsetHeight || 140;
  const aheadOffset = rect.width * 0.85;
  const animalCenter = rect.left + rect.width / 2;
  const idealLeft = facing === -1 ? animalCenter - aheadOffset : animalCenter + aheadOffset;
  const minLeft = margin + bw / 2;
  const maxLeft = window.innerWidth - margin - bw / 2;
  const clampedLeft = Math.min(maxLeft, Math.max(minLeft, idealLeft));
  const top = Math.max(margin + bh, rect.top - 8);
  bubble.style.left = clampedLeft + "px";
  bubble.style.top = top + "px";
}

/* The bubble is just an image — "Happy Birthday, Liam!" is baked into
   the artwork itself, no text is ever overlaid or shown as a fallback.
   Which graphic to use is based on which way the animal is currently
   facing (facing 1 = walking/facing right, -1 = left), tracked via
   el.dataset.facing in animateWalk: an animal facing right gets the
   bubble positioned ahead to its right, using thought-bubble-left.png
   (tail trailing back-left toward the animal); one facing left gets
   thought-bubble-right.png positioned ahead to its left. There is no
   plain/default thought-bubble.png anymore — if one variant fails to
   load, this falls back to the other rather than to any text. */
function buildAnimalBubbleHTML(facing){
  const src = facing === -1 ? "images/thought-bubble-right.png" : "images/thought-bubble-left.png";
  const fallbackSrc = facing === -1 ? "images/thought-bubble-left.png" : "images/thought-bubble-right.png";
  return `<img class="animalBubbleImg" src="${src}" alt="Happy Birthday, Liam!" loading="eager" ` +
    `onerror="this.onerror=null; this.src='${fallbackSrc}';">`;
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

  const rect = body.getBoundingClientRect();
  const facing = parseInt(el.dataset.facing || "1", 10);
  sharedBubble.innerHTML = buildAnimalBubbleHTML(facing);
  positionAnimalBubble(sharedBubble, rect, facing);
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
    el.dataset.facing = "1";
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