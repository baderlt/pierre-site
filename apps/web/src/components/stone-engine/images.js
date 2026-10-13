const MAX_EDGE = 2048;
const MAX_BYTES = 20 * 1024 * 1024;

export async function validateUpload(file) {
  if (!file || !['image/jpeg', 'image/png'].includes(file.type)) throw new Error('Choose a JPEG or PNG photograph.');
  if (file.size > MAX_BYTES) throw new Error('Please choose an image smaller than 20 MB.');
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (!jpeg && !png) throw new Error('This file is not a valid JPEG or PNG image.');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('This image could not be read. Try another JPEG or PNG.'));
    image.src = src;
  });
}

export async function prepareImage(source, crop) {
  let inputUrl;
  let previewUrl;
  try {
    inputUrl = source instanceof File ? URL.createObjectURL(source) : source;
    const image = await loadImage(inputUrl);
    const originalWidth = image.naturalWidth;
    const originalHeight = image.naturalHeight;
    if (originalWidth * originalHeight > 80_000_000) throw new Error('Please use a photograph under 80 megapixels.');
    const [cx, cy, cw, ch] = crop || [0, 0, 1, 1];
    const sourceWidth = originalWidth * cw;
    const sourceHeight = originalHeight * ch;
    const ratio = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * ratio));
    canvas.height = Math.max(1, Math.round(sourceHeight * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not process this photograph.');
    context.fillStyle = '#eeeae1';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, originalWidth * cx, originalHeight * cy, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) throw new Error('The image could not be prepared. Try a smaller photograph.');
    previewUrl = URL.createObjectURL(blob);
    const color = await loadImage(previewUrl);

    // Luminance is only an artistic height approximation. Fine deterministic grain
    // lets the rough preset read as stone without displacing the silhouette.
    const bump = document.createElement('canvas');
    const bumpRatio = Math.min(1, 1024 / Math.max(canvas.width, canvas.height));
    bump.width = Math.max(1, Math.round(canvas.width * bumpRatio));
    bump.height = Math.max(1, Math.round(canvas.height * bumpRatio));
    const bumpContext = bump.getContext('2d', { willReadFrequently: true });
    if (!bumpContext) throw new Error('Your browser could not create the surface detail map.');
    bumpContext.drawImage(canvas, 0, 0, bump.width, bump.height);
    const pixels = bumpContext.getImageData(0, 0, bump.width, bump.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const luminance = pixels.data[i] * 0.2126 + pixels.data[i + 1] * 0.7152 + pixels.data[i + 2] * 0.0722;
      const grain = ((Math.imul(i + 1, 1597334677) >>> 8) % 19) - 9;
      const value = Math.max(0, Math.min(255, 128 + (luminance - 128) * 0.65 + grain));
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
    }
    bumpContext.putImageData(pixels, 0, 0);
    canvas.width = canvas.height = 1;
    return {
      color, bump, previewUrl, width: color.naturalWidth, height: color.naturalHeight,
      originalWidth, originalHeight,
      dispose() { URL.revokeObjectURL(previewUrl); color.src = ''; bump.width = bump.height = 1; },
    };
  } catch (error) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    throw error;
  } finally {
    if (source instanceof File && inputUrl) URL.revokeObjectURL(inputUrl);
  }
}
