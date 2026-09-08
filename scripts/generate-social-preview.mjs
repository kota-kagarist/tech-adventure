import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sourceUrl = new URL('../assets/social-preview.png.base64', import.meta.url);
const outputUrl = new URL('../public/social-preview.png', import.meta.url);
const expectedSha256 = '43090b956820eba13fdf63529e78e47b5c541a17c17b31ab1c7326e63c797715';
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function validatePng(image) {
  if (image.length <= 100 || !image.subarray(0, 8).equals(pngSignature)) {
    throw new Error('social preview source is not a valid PNG');
  }
  if (image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 630) {
    throw new Error('social preview must be 1200x630');
  }

  let offset = 8;
  let foundIend = false;
  while (offset + 12 <= image.length) {
    const chunkLength = image.readUInt32BE(offset);
    const chunkEnd = offset + 12 + chunkLength;
    if (chunkEnd > image.length) throw new Error('social preview contains an incomplete PNG chunk');
    const chunkType = image.subarray(offset + 4, offset + 8).toString('ascii');
    offset = chunkEnd;
    if (chunkType === 'IEND') {
      foundIend = true;
      break;
    }
  }

  if (!foundIend || offset !== image.length) {
    throw new Error('social preview must end with a complete IEND chunk');
  }
}

const encoded = (await readFile(sourceUrl, 'utf8')).replace(/\s+/g, '');
const image = Buffer.from(encoded, 'base64');
const actualSha256 = createHash('sha256').update(image).digest('hex');

if (actualSha256 !== expectedSha256) {
  throw new Error(`social preview source hash mismatch: ${actualSha256}`);
}
validatePng(image);

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(outputUrl, image);
console.log(`Generated public/social-preview.png (${image.length} bytes)`);
