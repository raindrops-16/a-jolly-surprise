# His birthday site — setup guide

## ⚠️ Keep all files together in one folder
`index.html` only works when `styles.css`, `script.js`, `images/`, and
`audio/` sit right next to it in the **same folder**. If you download
`index.html` by itself, you'll get exactly what you just saw — a
plain white page with oversized images and no styling, because the
browser can't find the stylesheet or script to load. Always download
the whole `birthday-site.zip`, unzip it, and open `index.html` from
inside that unzipped folder.

## 1. Set the password
Open `script.js`, find this near the top:
```js
const SITE_PASSWORD = "changeme";
```
Change `"changeme"` to whatever password you want him to type.

## 2. Character images — already matched to your filenames
These are already wired up in `script.js` to look for exactly the
files you have:

| Character | Filename |
|---|---|
| Tsukune | tsukune.png |
| Yukari | yukari.png |
| Moka (Inner) | Moka-inner.png |
| Kurumu | kurumu.png |
| Jollibee & Friends | jollibee.png |
| Hello Kitty & Friends | kitty.png |
| Mizore | Mizore.png |
| Moka (Outer) | moka-outer.png |
| Bubu & Dudu | bubu.png |
| Captain Ri & Se-ri | cloy.png |
| Winnie the Pooh & Friends | pooh.png |

Just drop those 11 files into the `images` folder — filenames are
case-sensitive, so keep the capitalization exactly as shown (e.g.
`Mizore.png`, not `mizore.png`).

If a character still shows as a plain colored block instead of their
picture, that's the automatic fallback — it means that exact filename
isn't in `images` yet.

### Balloon icons (optional)
Each character's balloon can show a small icon at the top (like the
rosary cross for Moka Inner). Drop icon PNGs into `images/icons/`
named `<key>-icon.png`, using these keys:
tsukune, yukari, moka-inner, kurumu, jollibee, hellokitty, mizore,
moka-outer, bubu-dudu, captain-ri-seri, winnie-pooh.
Skip any you don't have — a matching emoji is used automatically.

## 3. Animals — idle, walk, and pose images
- **Cats**: `cat1.png` and `cat2.png` are each cat's resting picture,
  `cat-walk.gif` plays while they're wandering, `cat-pose.gif` plays
  when one is clicked (alongside the "Happy birthday!" bubble).
- **Dogs**: you don't have still/idle pictures yet, so until you add
  some, each dog just shows a 🐶/🐕 emoji when resting — but
  `dog-walk.gif` and `dogpose.gif` are already wired in, so both dogs
  will walk and pose using those gifs right now.
- All four of these already point at exactly the filenames you have:
  `cat1.png`, `cat2.png`, `cat-walk.gif`, `cat-pose.gif`,
  `dog-walk.gif`, `dogpose.gif`.

## 4. Music
`audio/song.mp3` is expected — if your file has a different name,
rename it to `song.mp3`. Browsers block autoplay with sound, so the
🎵 button at the top of the screen has to be tapped once to start it
— that's expected on both phone and desktop, not a bug.

## 5. Try it yourself first
Unzip the folder, then double-click `index.html` to open it in any
browser and test the password, balloons, and animals before sending
it to him.

## 6. Share it privately
This is a set of files, not a live website yet — to get him a link
only the two of you know, upload the *whole unzipped folder* to a
free static host, for example:
- **Netlify Drop** (netlify.com/drop) — drag the folder in, get a link instantly, no account needed
- **GitHub Pages** — if you already use GitHub, push it to a repo and enable Pages

## About sizing
Layout is fluid (`clamp()`/`%`-based), scaling from a Samsung S23
Ultra screen up to a 24–30" curved monitor without separate versions.

## If you want changes
Content — names, messages, balloon colors, filenames — lives in the
`CHARACTERS` and `ANIMALS` arrays near the top of `script.js`, in
plain readable form. Just ask me and I can also adjust colors, timing,
or add more characters/animals.
