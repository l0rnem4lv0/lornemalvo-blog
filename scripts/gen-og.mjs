/**
 * Generates public/og-default.png (1200x630) from an SVG template.
 * Run once: node scripts/gen-og.mjs
 */

import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-default.png');

const W = 1200;
const H = 630;
const GRID = 60;

// Build grid lines
const gridLines = [];
for (let x = 0; x <= W; x += GRID) {
  gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`);
}
for (let y = 0; y <= H; y += GRID) {
  gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>

  <g stroke="#1a1a1a" stroke-width="0.5" fill="none">
    ${gridLines.join('\n    ')}
  </g>

  <text
    x="${W / 2}" y="${H / 2 - 28}"
    text-anchor="middle"
    dominant-baseline="auto"
    font-family="'JetBrains Mono', monospace"
    font-size="80"
    font-weight="700"
    fill="#00ff9c"
    letter-spacing="-2"
  >lornemalvo</text>

  <line
    x1="${W / 2 - 200}" y1="${H / 2 + 10}"
    x2="${W / 2 + 200}" y2="${H / 2 + 10}"
    stroke="#1f1f1f" stroke-width="2"
  />

  <text
    x="${W / 2}" y="${H / 2 + 50}"
    text-anchor="middle"
    dominant-baseline="hanging"
    font-family="'JetBrains Mono', monospace"
    font-size="24"
    font-weight="400"
    fill="#888888"
    letter-spacing="5"
  >security research</text>
</svg>`;

const buffer = Buffer.from(svg);

const png = await sharp(buffer)
  .resize(W, H)
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(OUT, png);

const kb = (png.length / 1024).toFixed(1);
console.log(`✓ ${OUT}`);
console.log(`  size: ${kb} KB`);

const meta = await sharp(OUT).metadata();
console.log(`  dims: ${meta.width}×${meta.height}`);
