/* LadeVault app icon builder - Fluent 2 style.
 * Generates 6 distinct app icons with layered geometric shapes,
 * 135-degree diagonal gradients, soft drop shadows, and rounded corners.
 * Outputs: SVG masters, multi-resolution PNGs, ICO files, and favicon installs.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, 'icons');
const PNG_DIR = path.join(OUT, 'png');
const ICO_DIR = path.join(OUT, 'ico');
const FAVICON_DIR = path.join(__dirname, '..', 'customize.dist', 'favicon');

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PNG_DIR, { recursive: true });
fs.mkdirSync(ICO_DIR, { recursive: true });
fs.mkdirSync(FAVICON_DIR, { recursive: true });

// ---- shared constants ----
const CANVAS = 512;
const RADIUS = 112; // ~22% of 512
const SHADOW_DX = 4;
const SHADOW_DY = 6;
const SHADOW_BLUR = 12;
const SHADOW_OPACITY = 0.35;

// ---- icon definitions ----
const ICONS = [
    {
        name: 'pad',
        hi: '#71826E',
        lo: '#556651',
        buildSvg: buildPadSvg,
    },
    {
        name: 'kanban',
        hi: '#5F7A52',
        lo: '#4A6140',
        buildSvg: buildKanbanSvg,
    },
    {
        name: 'code',
        hi: '#7A8257',
        lo: '#616B42',
        buildSvg: buildCodeSvg,
    },
    {
        name: 'form',
        hi: '#5E8277',
        lo: '#476459',
        buildSvg: buildFormSvg,
    },
    {
        name: 'diagram',
        hi: '#8C8564',
        lo: '#6E6849',
        buildSvg: buildDiagramSvg,
    },
    {
        name: 'slide',
        hi: '#66756B',
        lo: '#4F5B53',
        buildSvg: buildSlideSvg,
    },
];

// ---- SVG helpers ----

function defs(id, hi, lo) {
    return `  <defs>
    <linearGradient id="grad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="100%" stop-color="${lo}"/>
    </linearGradient>
    <linearGradient id="highlight_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow_${id}" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="${SHADOW_DX}" dy="${SHADOW_DY}" stdDeviation="${SHADOW_BLUR}" flood-color="#000000" flood-opacity="${SHADOW_OPACITY}"/>
    </filter>
  </defs>`;
}

function wrapSvg(id, hi, lo, content) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
${defs(id, hi, lo)}
${content}
</svg>`;
}

// Simplified version for small sizes (no shadow filter, no highlight overlay)
function defsSimple(id, hi, lo) {
    return `  <defs>
    <linearGradient id="grad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="100%" stop-color="${lo}"/>
    </linearGradient>
  </defs>`;
}

function wrapSvgSimple(id, hi, lo, content) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
${defsSimple(id, hi, lo)}
${content}
</svg>`;
}

// Helper: rounded rect path
function roundedRect(x, y, w, h, r) {
    return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
}

// ---- PAD icon: folded document with secondary page behind ----
function buildPadSvg(icon) {
    const { name, hi, lo } = icon;
    // Back page (slightly offset)
    const backPage = roundedRect(130, 72, 250, 320, 24);
    // Front page (main)
    const frontPage = roundedRect(152, 100, 250, 320, 24);
    // Dog-ear fold on front page
    const foldX = 152 + 250 - 60;
    const foldY = 100;
    const fold = `M${foldX},${foldY} L${152 + 250},${foldY + 60} L${152 + 250},${foldY} Z`;
    // Text lines on front page
    const lines = [180, 210, 240, 270, 300].map(ly =>
        `    <rect x="185" y="${ly}" width="${ly === 300 ? 120 : 180}" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/>`
    ).join('\n');

    const content = `  <!-- back page -->
  <path d="${backPage}" fill="${darken(hi, 0.7)}" filter="url(#shadow_${name})"/>
  <!-- front page -->
  <path d="${frontPage}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- dog-ear fold -->
  <path d="${fold}" fill="${darken(lo, 0.85)}"/>
  <!-- text lines -->
${lines}
  <!-- highlight overlay -->
  <path d="${frontPage}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, content);
}

function buildPadSvgSimple(icon) {
    const { name, hi, lo } = icon;
    const backPage = roundedRect(130, 72, 250, 320, 24);
    const frontPage = roundedRect(152, 100, 250, 320, 24);
    const content = `  <path d="${backPage}" fill="${darken(hi, 0.7)}"/>
  <path d="${frontPage}" fill="url(#grad_${name})"/>`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- KANBAN icon: 2-3 stacked/offset rounded rects (board columns) ----
function buildKanbanSvg(icon) {
    const { name, hi, lo } = icon;
    // Three offset column cards
    const card1 = roundedRect(110, 120, 100, 280, 20);
    const card2 = roundedRect(220, 90, 100, 310, 20);
    const card3 = roundedRect(330, 140, 100, 260, 20);

    const content = `  <!-- column 1 (back) -->
  <path d="${card1}" fill="${darken(hi, 0.7)}" filter="url(#shadow_${name})"/>
  <!-- column 2 (middle, tallest) -->
  <path d="${card2}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- column 3 (front) -->
  <path d="${card3}" fill="${darken(lo, 0.9)}" filter="url(#shadow_${name})"/>
  <!-- row indicators on middle card -->
  <rect x="238" y="130" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="238" y="155" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.2"/>
  <rect x="238" y="180" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.15"/>
  <!-- highlight on middle card -->
  <path d="${card2}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, content);
}

function buildKanbanSvgSimple(icon) {
    const { name, hi, lo } = icon;
    // Two wider columns for better legibility at 16px
    const card1 = roundedRect(100, 110, 150, 290, 24);
    const card2 = roundedRect(270, 80, 150, 320, 24);
    const content = `  <path d="${card1}" fill="${darken(hi, 0.7)}"/>
  <path d="${card2}" fill="url(#grad_${name})"/>`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- CODE icon: rounded document with angle-bracket <> symbol ----
function buildCodeSvg(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(132, 80, 248, 352, RADIUS * 0.22);
    // Angle brackets as paths
    const leftBracket = 'M220,256 L180,290 L220,324';
    const rightBracket = 'M292,256 L332,290 L292,324';
    // Slash between brackets
    const slash = 'M270,240 L242,340';

    // Build with back layer behind (correct paint order)
    const backLayer = roundedRect(115, 65, 248, 352, RADIUS * 0.22);
    const reordered = `  <!-- back document layer -->
  <path d="${backLayer}" fill="${darken(hi, 0.65)}" filter="url(#shadow_${name})"/>
  <!-- front document body -->
  <path d="${doc}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- code brackets -->
  <path d="${leftBracket}" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${rightBracket}" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${slash}" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="14" stroke-linecap="round"/>
  <!-- highlight -->
  <path d="${doc}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, reordered);
}

function buildCodeSvgSimple(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(132, 80, 248, 352, RADIUS * 0.22);
    const backLayer = roundedRect(115, 65, 248, 352, RADIUS * 0.22);
    const leftBracket = 'M220,256 L180,290 L220,324';
    const rightBracket = 'M292,256 L332,290 L292,324';
    const content = `  <path d="${backLayer}" fill="${darken(hi, 0.65)}"/>
  <path d="${doc}" fill="url(#grad_${name})"/>
  <path d="${leftBracket}" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${rightBracket}" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- FORM icon: document with horizontal bars/checkboxes ----
function buildFormSvg(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(140, 80, 248, 360, 28);
    const backDoc = roundedRect(124, 64, 248, 360, 28);

    // Form rows: checkbox + line
    const rows = [170, 220, 270, 320, 370].map((ry, i) => {
        const checked = i < 3;
        const box = `<rect x="172" y="${ry}" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/>`;
        const check = checked ? `<path d="M178,${ry + 14} L184,${ry + 20} L194,${ry + 8}" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : '';
        const line = `<rect x="215" y="${ry + 8}" width="${130 - (i % 2) * 30}" height="12" rx="6" fill="#ffffff" fill-opacity="${checked ? 0.35 : 0.2}"/>`;
        return `    ${box}\n    ${check}\n    ${line}`;
    }).join('\n');

    const content = `  <!-- back document layer -->
  <path d="${backDoc}" fill="${darken(hi, 0.65)}" filter="url(#shadow_${name})"/>
  <!-- front document -->
  <path d="${doc}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- form rows -->
${rows}
  <!-- highlight -->
  <path d="${doc}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, content);
}

function buildFormSvgSimple(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(140, 80, 248, 360, 28);
    const backDoc = roundedRect(124, 64, 248, 360, 28);
    const bars = [180, 230, 280, 330].map(ry =>
        `  <rect x="172" y="${ry}" width="160" height="16" rx="8" fill="#ffffff" fill-opacity="0.35"/>`
    ).join('\n');
    const content = `  <path d="${backDoc}" fill="${darken(hi, 0.65)}"/>
  <path d="${doc}" fill="url(#grad_${name})"/>
${bars}`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- DIAGRAM icon: document with connected nodes/arrows ----
function buildDiagramSvg(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(132, 80, 260, 360, 28);
    const backDoc = roundedRect(116, 64, 260, 360, 28);

    // Three nodes with connecting lines
    const node1 = { cx: 210, cy: 220 };
    const node2 = { cx: 310, cy: 180 };
    const node3 = { cx: 260, cy: 320 };
    const nodeR = 22;

    const content = `  <!-- back document layer -->
  <path d="${backDoc}" fill="${darken(hi, 0.65)}" filter="url(#shadow_${name})"/>
  <!-- front document -->
  <path d="${doc}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- connecting lines -->
  <line x1="${node1.cx}" y1="${node1.cy}" x2="${node2.cx}" y2="${node2.cy}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/>
  <line x1="${node1.cx}" y1="${node1.cy}" x2="${node3.cx}" y2="${node3.cy}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/>
  <line x1="${node2.cx}" y1="${node2.cy}" x2="${node3.cx}" y2="${node3.cy}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/>
  <!-- arrow head on line from node1 to node2 -->
  <path d="M${node2.cx - 12},${node2.cy + 4} L${node2.cx - 4},${node2.cy} L${node2.cx - 12},${node2.cy - 4}" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- nodes -->
  <circle cx="${node1.cx}" cy="${node1.cy}" r="${nodeR}" fill="#ffffff" fill-opacity="0.8"/>
  <circle cx="${node2.cx}" cy="${node2.cy}" r="${nodeR}" fill="#ffffff" fill-opacity="0.6"/>
  <circle cx="${node3.cx}" cy="${node3.cy}" r="${nodeR}" fill="#ffffff" fill-opacity="0.7"/>
  <!-- highlight -->
  <path d="${doc}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, content);
}

function buildDiagramSvgSimple(icon) {
    const { name, hi, lo } = icon;
    const doc = roundedRect(132, 80, 260, 360, 28);
    const backDoc = roundedRect(116, 64, 260, 360, 28);
    const content = `  <path d="${backDoc}" fill="${darken(hi, 0.65)}"/>
  <path d="${doc}" fill="url(#grad_${name})"/>
  <circle cx="210" cy="220" r="24" fill="#ffffff" fill-opacity="0.8"/>
  <circle cx="310" cy="180" r="24" fill="#ffffff" fill-opacity="0.6"/>
  <circle cx="260" cy="320" r="24" fill="#ffffff" fill-opacity="0.7"/>
  <line x1="210" y1="220" x2="310" y2="180" stroke="#ffffff" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/>
  <line x1="210" y1="220" x2="260" y2="320" stroke="#ffffff" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/>`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- SLIDE icon: 2-3 stacked rounded rects like slide deck ----
function buildSlideSvg(icon) {
    const { name, hi, lo } = icon;
    // Three stacked slides with offset
    const slide1 = roundedRect(120, 130, 290, 200, 22);
    const slide2 = roundedRect(140, 150, 290, 200, 22);
    const slide3 = roundedRect(160, 170, 290, 200, 22);

    const content = `  <!-- back slide -->
  <path d="${slide1}" fill="${darken(hi, 0.6)}" filter="url(#shadow_${name})"/>
  <!-- middle slide -->
  <path d="${slide2}" fill="${darken(hi, 0.8)}" filter="url(#shadow_${name})"/>
  <!-- front slide -->
  <path d="${slide3}" fill="url(#grad_${name})" filter="url(#shadow_${name})"/>
  <!-- content hint on front slide -->
  <rect x="185" y="210" width="140" height="14" rx="7" fill="#ffffff" fill-opacity="0.35"/>
  <rect x="185" y="240" width="100" height="10" rx="5" fill="#ffffff" fill-opacity="0.2"/>
  <!-- small shape placeholder -->
  <circle cx="360" cy="280" r="30" fill="#ffffff" fill-opacity="0.15"/>
  <!-- highlight -->
  <path d="${slide3}" fill="url(#highlight_${name})"/>`;

    return wrapSvg(name, hi, lo, content);
}

function buildSlideSvgSimple(icon) {
    const { name, hi, lo } = icon;
    const slide1 = roundedRect(120, 130, 290, 200, 22);
    const slide2 = roundedRect(140, 150, 290, 200, 22);
    const slide3 = roundedRect(160, 170, 290, 200, 22);
    const content = `  <path d="${slide1}" fill="${darken(hi, 0.6)}"/>
  <path d="${slide2}" fill="${darken(hi, 0.8)}"/>
  <path d="${slide3}" fill="url(#grad_${name})"/>`;
    return wrapSvgSimple(name, hi, lo, content);
}

// ---- color utility ----
function darken(hex, factor) {
    const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
    const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
    const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ---- simple SVG builders map ----
const SIMPLE_BUILDERS = {
    pad: buildPadSvgSimple,
    kanban: buildKanbanSvgSimple,
    code: buildCodeSvgSimple,
    form: buildFormSvgSimple,
    diagram: buildDiagramSvgSimple,
    slide: buildSlideSvgSimple,
};

// ---- PNG rendering ----
async function renderPng(svgString, size, dest) {
    const density = Math.max(72, Math.round(size / CANVAS * 384));
    const buf = await sharp(Buffer.from(svgString), { density })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    fs.writeFileSync(dest, buf);
    return buf;
}

// ---- ICO builder (same pattern as build-logo.js) ----
function buildIco(entries) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);       // reserved
    header.writeUInt16LE(1, 2);       // type: icon
    header.writeUInt16LE(entries.length, 4);
    const dir = Buffer.alloc(16 * entries.length);
    let offset = 6 + dir.length;
    const blobs = [];
    entries.forEach((e, i) => {
        const b = i * 16;
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0);
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
        dir.writeUInt8(0, b + 2);
        dir.writeUInt8(0, b + 3);
        dir.writeUInt16LE(1, b + 4);
        dir.writeUInt16LE(32, b + 6);
        dir.writeUInt32LE(e.buf.length, b + 8);
        dir.writeUInt32LE(offset, b + 12);
        offset += e.buf.length;
        blobs.push(e.buf);
    });
    return Buffer.concat([header, dir, ...blobs]);
}

// ---- main build ----
(async () => {
    const SIZES = [512, 256, 128, 64, 32, 16];
    const ICO_SIZES = [16, 32, 48];

    for (const icon of ICONS) {
        const { name } = icon;
        console.log(`building: ${name}`);

        // Generate master SVG (full detail)
        const masterSvg = icon.buildSvg(icon);
        fs.writeFileSync(path.join(OUT, `${name}.svg`), masterSvg);

        // Generate simplified SVG for small sizes
        const simpleSvg = SIMPLE_BUILDERS[name](icon);

        // Render PNGs at all sizes
        for (const size of SIZES) {
            const src = size <= 48 ? simpleSvg : masterSvg;
            await renderPng(src, size, path.join(PNG_DIR, `${name}-${size}.png`));
        }

        // Build ICO (16+32+48 entries using simplified SVG)
        const icoEntries = [];
        for (const size of ICO_SIZES) {
            const buf = await renderPng(simpleSvg, size, path.join(PNG_DIR, `${name}-${size}-ico.png`));
            icoEntries.push({ size, buf });
            // Clean up the temp ico png
            fs.unlinkSync(path.join(PNG_DIR, `${name}-${size}-ico.png`));
        }
        const icoBuf = buildIco(icoEntries);
        fs.writeFileSync(path.join(ICO_DIR, `${name}.ico`), icoBuf);

        // Install to customize.dist/favicon/ (including aliases for doc, poll, presentation)
        const png512 = path.join(PNG_DIR, `${name}-512.png`);
        const pngBuf = fs.readFileSync(png512);
        const ALIASES = {
            pad: ['doc'],
            form: ['poll'],
            slide: ['presentation']
        };
        const targets = [name, ...(ALIASES[name] || [])];
        for (const target of targets) {
            fs.writeFileSync(path.join(FAVICON_DIR, `main-favicon-${target}.png`), pngBuf);
            fs.writeFileSync(path.join(FAVICON_DIR, `alt-favicon-${target}.png`), pngBuf);
            fs.writeFileSync(path.join(FAVICON_DIR, `main-favicon-${target}.ico`), icoBuf);
            fs.writeFileSync(path.join(FAVICON_DIR, `alt-favicon-${target}.ico`), icoBuf);
        }

        // Also copy master SVG to customize.dist/images/icons/
        const CUST_ICON_DIR = path.join(__dirname, '..', 'customize.dist', 'images', 'icons');
        fs.mkdirSync(CUST_ICON_DIR, { recursive: true });
        fs.writeFileSync(path.join(CUST_ICON_DIR, `${name}.svg`), masterSvg);
    }

    console.log('done. All 6 app icons built and installed.');
})();
