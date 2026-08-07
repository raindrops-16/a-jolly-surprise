/* ======================================================================
   SHARED CHARACTER DATA — used by BOTH script.js (desktop) and
   script-mobile.js (mobile), so you only edit a character's message,
   color, icon, or font ONCE and it's correct on both layouts.

   balloonFontSize / balloonMinFontSize       → used on DESKTOP only
   balloonFontSizeMobile / balloonMinFontSizeMobile → used on MOBILE only
   (mobile now auto-fits reliably, so these mobile overrides are optional
   safety nets, not required — script-mobile.js falls back to sensible
   defaults if you don't set them for a character)
   ====================================================================== */

const CHARACTERS = [
  { key:"tsukune", name:"Tsukune", img:"tsukune.png", color:"#424194", icon:"🧛‍♂️",
    iconFile:"vampire-icon.png", font:"'Sue Ellen Francisco', cursive",
    balloonFontSize:2.4, balloonMinFontSize:1.9,
    balloonFontSizeMobile:1.6, balloonMinFontSizeMobile:0.9,
    msg:"Happy Birthday! I hope you have an awesome day and that all your wishes come true. Thanks for everything, and here's to another great year. Enjoy your special day! 👊" },

  { key:"yukari", name:"Yukari", img:"yukari.png", color:"#9b5de5", icon:"🪄",
    font:"'Crafty Girls', cursive", balloonFontSize:1.36,
    msg:"Ta-da! Happy Birthday! 🎂 I've cast my special birthday spell just for you! May your year be full of happiness, good luck, and amazing adventures! Don't forget to save me a slice of cake, okay? Hehe! 💖🪄" },

  { key:"moka-inner", name:"Inner Moka", img:"Moka-inner.png", color:"#f389a9", icon:"🦷",
    iconFile:"moka-inner-icon.png", font:"'Comforter Brush', cursive", balloonFontSize:1.55,
    msg:"I don't usually say things like this... but I'm glad you're here today. Don't waste today worrying about the past. Celebrate, smile, and become even stronger. I hope this year brings you happiness worth remembering. I'll be expecting great things from you next year, too. Happy Birthday! <img class=\"inlineIcon\" src=\"images/icons/fangs-icon.png\" alt=\"🦷\" onerror=\"this.replaceWith(document.createTextNode('🦷'));\">" },

  { key:"kurumu", name:"Kurumu", img:"kurumu.png", color:"#df0747", icon:"🪽",
    iconFile:"wings-icon.png", font:"'Emilys Candy', cursive", balloonFontSize:1.52,
    msg:"Happy Birthday! I hope today is filled with lots of happiness, sweet surprises, and wonderful memories. You deserve to smile all day long! Hehe... I wish I could spend the whole day celebrating with you. Have an amazing birthday, okay? 💙" },

  { key:"jollibee", name:"Jollibee & Friends", img:"jollibee.png", color:"#ffb703", icon:"🐝",
    iconFile:"bee-icon.png", font:"'Indie Flower', cursive", balloonFontSize:1.68,
    msg:"Happy Birthday to you! We hope your day is filled with love, laughter, yummy food, and the people who make you smile. Wishing you a year full of happiness and exciting adventures. Have a Jolly Happy Birthday! 🎉🎂🎈" },

  { key:"hellokitty", name:"Hello Kitty & Friends", img:"kitty.png", color:"#2a9d8f", icon:"🎀",
    font:"'Englebert', cursive", balloonFontSize:1.56,
    msg:"Happy Birthday! We hope your special day is filled with love, laughter, friendship, and magical memories! Have the most wonderful birthday ever! We love you! 🎂🎈🎁💕" },

  { key:"mizore", name:"Mizore", img:"Mizore.png", color:"#6a4c93", icon:"❄️",
    iconFile:"snowflakes-icon.png", font:"'Snowburst One', cursive", balloonFontSize:1.45,
    msg:"Happy birthday. I... made this just for you. I hope it makes you smile. May this year bring you lots of happiness... and I'll be wishing for your dreams to come true too. 💙❄️" },

  { key:"moka-outer", name:"Outer Moka", img:"moka-outer.png", color:"#00b7c2", icon:"🌸",
    iconFile:"moka-outer-icon.png", font:"'Liu Jian Mao Cao', cursive", balloonFontSize:1.27,
    msg:"Happy Birthday! Yay! I'm so happy I get to celebrate this special day with you. May your heart always be filled with love, your dreams come true, and every day bring you something to smile about! Eat lots of delicious cake, have tons of fun, and remember that I'll always be cheering you on. Have an amazing birthday! 🌹💕😘" },

  { key:"bubu-dudu", name:"Bubu & Dudu", img:"bubu.png", color:"#ffffff", textColor:"#12204a", icon:"🧸",
    iconFile:"bear-icon.png", font:"'Sunshiney', cursive", balloonFontSize:1.44,
    msg:"Happy Birthday, our favorite human! Today is all about you! Eat lots of cake, make wonderful memories, laugh from your heart, and never forget how loved you are. We're giving you the biggest Bubu & Dudu bear hug ever! Have the happiest birthday! 🎂🎈🎁💕" },

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