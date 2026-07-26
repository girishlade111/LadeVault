/* LadeVault logo/icon builder.
 * Hand-authored vector master -> PNG set + .ico, all from one SVG source.
 * Concept: unified multi-format workspace = shield (privacy/vault) fused with
 * a layered document stack (multi-format). Single bold glyph, two tones of the
 * brand azure for depth, subtle gradient + edge light + fine grain.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = __dirname;
const FAVICON_DIR = path.join(OUT, 'favicon');
fs.mkdirSync(FAVICON_DIR, { recursive: true });

// ---- palette (monochrome-ish: brand azure + darker tonal shade) ----
const C = {
    hi:    '#33A1FF', // top light of gradient
    brand: '#0087FF', // LadeVault brand
    lo:    '#0067CC', // bottom of gradient
    back:  '#0059B8', // back stacked layer (darker tone)
    fold:  '#0061C4', // dog-ear flap
    innerShadow: '#003E80',
};

/* --- front shield-document outline --------------------------------------
 * A rounded-corner sheet whose bottom tapers to a soft shield point.
 * Top-right corner is dog-eared (document cue). Left/right x = 168 / 344.
 */
const FRONT = [
    'M168,156',
    'Q168,132 192,132',       // top-left rounded corner
    'L300,132',               // top edge -> dog-ear notch
    'L344,176',               // fold diagonal (cut corner)
    'L344,300',               // right edge down
    'C344,342 322,372 256,398', // right shoulder -> shield tip
    'C190,372 168,342 168,300', // shield tip -> left shoulder
    'Z',
].join(' ');

// back layer: same silhouette, plainer, shifted up-left so it peeks as a stack
const BACK = FRONT; // reused via transform

// dog-ear flap (the folded-over triangle)
const FLAP = 'M300,132 L300,176 L344,176 Z';

// horizontal "layer" seam inside the sheet — reinforces multi-format stack,
// kept as a subtle lighter hairline, disappears gracefully at tiny sizes.
const SEAM = 'M168,252 C168,252 344,252 344,252';

const SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="${C.hi}"/>
      <stop offset="0.55" stop-color="${C.brand}"/>
      <stop offset="1"    stop-color="${C.lo}"/>
    </linearGradient>
    <linearGradient id="edgeLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.30" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.80" stop-color="${C.innerShadow}" stop-opacity="0"/>
      <stop offset="1"    stop-color="${C.innerShadow}" stop-opacity="0.30"/>
    </linearGradient>
    <clipPath id="clipFront"><path d="${FRONT}"/></clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a"/>
      <feComposite in="a" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>

  <!-- back stacked layer (multi-format depth) -->
  <path d="${BACK}" transform="translate(-17,-15)" fill="${C.back}"/>

  <!-- front sheet -->
  <path d="${FRONT}" fill="url(#face)"/>

  <!-- inner layer seam -->
  <path d="${SEAM}" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="6" stroke-linecap="round" clip-path="url(#clipFront)"/>

  <!-- dog-ear flap (document cue) -->
  <path d="${FLAP}" fill="${C.fold}"/>

  <!-- fine grain, clipped to the face -->
  <g clip-path="url(#clipFront)">
    <rect x="0" y="0" width="512" height="512" filter="url(#grain)" opacity="0.05"/>
  </g>

  <!-- edge light + inner shadow for dimensionality -->
  <path d="${FRONT}" fill="url(#edgeLight)"/>
</svg>`;

fs.writeFileSync(path.join(OUT, 'ladevault-logo.svg'), SVG);

/* Favicon-optimized variant: same silhouette, no seam/grain (which turn to mud
 * below ~32px), bolder fold, flatter two-stop gradient. Keeps the mark legible
 * at 16px per the "no busy detail at small size" requirement. */
const SVG_FAVICON = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.hi}"/>
      <stop offset="1" stop-color="${C.lo}"/>
    </linearGradient>
  </defs>
  <path d="${BACK}" transform="translate(-19,-17)" fill="${C.back}"/>
  <path d="${FRONT}" fill="url(#face)"/>
  <path d="${FLAP}" fill="${C.fold}"/>
</svg>`;
fs.writeFileSync(path.join(OUT, 'ladevault-favicon.svg'), SVG_FAVICON);

// ---------- rasterize ----------
const svgBuf = Buffer.from(SVG);
const faviconBuf = Buffer.from(SVG_FAVICON);
async function png(size, file, source) {
    const src = source || svgBuf;
    await sharp(src, { density: Math.max(72, Math.round(size / 512 * 384)) })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(file);
    return fs.readFileSync(file);
}

// ---------- minimal PNG-embedded .ico writer ----------
function buildIco(entries) {
    // entries: [{size, buf}]
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);       // reserved
    header.writeUInt16LE(1, 2);       // type: icon
    header.writeUInt16LE(entries.length, 4);
    const dir = Buffer.alloc(16 * entries.length);
    let offset = 6 + dir.length;
    const blobs = [];
    entries.forEach((e, i) => {
        const b = i * 16;
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0); // width
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1); // height
        dir.writeUInt8(0, b + 2);   // palette
        dir.writeUInt8(0, b + 3);   // reserved
        dir.writeUInt16LE(1, b + 4);  // color planes
        dir.writeUInt16LE(32, b + 6); // bpp
        dir.writeUInt32LE(e.buf.length, b + 8);
        dir.writeUInt32LE(offset, b + 12);
        offset += e.buf.length;
        blobs.push(e.buf);
    });
    return Buffer.concat([header, dir, ...blobs]);
}

(async () => {
    const master = await png(1024, path.join(OUT, 'ladevault-logo-1024.png'));       // master
    await png(512, path.join(OUT, 'ladevault-app-512.png'));                          // PWA / manifest
    const p48 = await png(48, path.join(FAVICON_DIR, 'favicon-48.png'), faviconBuf);
    const p32 = await png(32, path.join(FAVICON_DIR, 'favicon-32.png'), faviconBuf);
    const p16 = await png(16, path.join(FAVICON_DIR, 'favicon-16.png'), faviconBuf);
    // preview strips for review
    await png(96, path.join(OUT, 'preview-96.png'));
    await png(32, path.join(OUT, 'preview-fav32.png'), faviconBuf);
    await png(16, path.join(OUT, 'preview-fav16.png'), faviconBuf);
    const ico = buildIco([
        { size: 16, buf: p16 },
        { size: 32, buf: p32 },
        { size: 48, buf: p48 },
    ]);
    fs.writeFileSync(path.join(FAVICON_DIR, 'favicon.ico'), ico);
    console.log('done. master bytes:', master.length);
})();
