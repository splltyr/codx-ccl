import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../public/assets');

const filesToProcess = [
  'mascot-default.png',
  'mascot-autumn.png',
  'mascot-booth.png',
  'mascot-codx-mushroom.png'
];

async function removeOuterWhite(filename) {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filename}, file not found.`);
    return;
  }

  console.log(`Processing ${filename}...`);
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Extract raw RGBA pixel buffer
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 4 (RGBA)

  const isWhite = (r, g, b) => {
    return r >= 238 && g >= 238 && b >= 238;
  };

  // Visited array for BFS flood fill from edges
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed BFS with all edge pixels that are white
  for (let x = 0; x < width; x++) {
    // top row
    let idx0 = (0 * width + x) * channels;
    if (isWhite(data[idx0], data[idx0 + 1], data[idx0 + 2])) {
      visited[x] = 1;
      queue.push(x);
    }
    // bottom row
    let yBottom = height - 1;
    let idxB = (yBottom * width + x) * channels;
    if (isWhite(data[idxB], data[idxB + 1], data[idxB + 2])) {
      visited[yBottom * width + x] = 1;
      queue.push(yBottom * width + x);
    }
  }

  for (let y = 0; y < height; y++) {
    // left column
    let idxL = (y * width + 0) * channels;
    if (isWhite(data[idxL], data[idxL + 1], data[idxL + 2])) {
      visited[y * width] = 1;
      queue.push(y * width);
    }
    // right column
    let xRight = width - 1;
    let idxR = (y * width + xRight) * channels;
    if (isWhite(data[idxR], data[idxR + 1], data[idxR + 2])) {
      visited[y * width + xRight] = 1;
      queue.push(y * width + xRight);
    }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          const p = nIndex * channels;
          if (isWhite(data[p], data[p + 1], data[p + 2])) {
            visited[nIndex] = 1;
            queue.push(nIndex);
          }
        }
      }
    }
  }

  // Set alpha = 0 for all outer flood-filled pixels
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] === 1) {
      data[i * channels + 3] = 0; // Transparent
    }
  }

  // Backup original file
  const backupPath = path.join(assetsDir, `${filename}.bak`);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  // Write new transparent PNG
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(filePath);

  console.log(`Successfully converted ${filename} into a clean transparent PNG cutout!`);
}

async function run() {
  for (const f of filesToProcess) {
    await removeOuterWhite(f);
  }
  console.log('All mascot cutouts processed successfully.');
}

run().catch(console.error);
