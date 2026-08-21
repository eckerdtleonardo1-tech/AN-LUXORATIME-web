const Jimp = require('jimp');

async function cropToCircle() {
  try {
    const image = await Jimp.read('public/logo.jpg');
    
    // Resize if too large
    if (image.bitmap.width > 800) {
      image.resize(800, Jimp.AUTO);
    }
    
    const size = Math.min(image.bitmap.width, image.bitmap.height);
    
    // Crop to square from center
    image.crop(
      (image.bitmap.width - size) / 2,
      (image.bitmap.height - size) / 2,
      size,
      size
    );
    
    // Create circle mask
    image.circle();
    
    await image.writeAsync('public/logo-cropped.png');
    console.log('Logo cropped successfully!');
  } catch (err) {
    console.error('Error cropping logo:', err);
  }
}

cropToCircle();
