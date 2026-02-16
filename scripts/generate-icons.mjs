import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svg = readFileSync(resolve(root, 'app/icon.svg'));

const sizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(resolve(root, 'public', name));
  console.log(`✅ ${name} (${size}x${size})`);
}

// Also copy SVG to public for direct serving
const { copyFileSync } = await import('fs');
copyFileSync(resolve(root, 'app/icon.svg'), resolve(root, 'public/icon.svg'));
console.log('✅ icon.svg copied to public/');
