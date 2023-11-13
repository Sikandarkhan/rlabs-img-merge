const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');

// Register the custom font
const fontPath = './BilyaSignature.ttf'; // Make sure this path is correct
registerFont(fontPath, { family: 'BilyaSignature' });

// Define the paths to your images
const image2Path = './MoleculeLogoV8.png';
const image1Path = './ScorpioDigitalArt.png';
// const image1Path = './rudralabs_root_chakra_symbol_in_ornate_indian_temple_art_style__a11d60f3-b9c3-4d17-b7dd-9fd9da892104.png';

// Define dimensions in pixels, assuming a DPI of 300 for print-quality images
const dpi = 300;
const cmToPixel = (cm) => Math.round(cm * (dpi / 2.54));

// Define the total dimensions of the final image
const totalWidth = cmToPixel(24.2);
const totalHeight = cmToPixel(17);

// Calculate positions and dimensions based on the final image size
const image2Top = cmToPixel(2.5);
const image1Top = cmToPixel(1);
const image2Bottom = cmToPixel(2);
const image1Bottom = cmToPixel(2);
const image2Height = totalHeight - image2Top - image2Bottom;
const image1Height = totalHeight - image1Top - image1Bottom;
const image2Aspect = 1 / 8.5; // Aspect ratio for Image 2
const image1Aspect = 12 / 9; // Aspect ratio for Image 1
const image2Width = Math.round(image2Height * image2Aspect);
const image1Width = Math.round(image1Height * image1Aspect);

// Text properties
const textHeightPixels = cmToPixel(1); // Height for the text "Scorpio"

const fontSize = 250; // Font size for the text "Scorpio"


// Create a canvas to draw text on
const canvas = createCanvas(totalWidth, fontSize);
const ctx = canvas.getContext('2d');
ctx.font = `${fontSize}px 'BilyaSignature'`;
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';

// Draw the text "Scorpio" on the canvas
const text = 'Scorpio';
ctx.fillText(text, totalWidth / 2, 0); // Center the text in the total width

// Convert canvas to buffer for the text
const textBuffer = canvas.toBuffer('image/png');

(async () => {
  try {
    // Process the images
    const processedImage2 = await sharp(image2Path)
      .resize(image2Width, image2Height)
      .toBuffer();

    const processedImage1 = await sharp(image1Path)
      .resize(image1Width, image1Height)
      .toBuffer();

    // Composite the images and the text onto the final image
    const finalImageBuffer = await sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 4,
        background: 'white'
      }
    })
    .png()
    .composite([
      { input: processedImage2, top: image2Top, left: 0 },
      { input: processedImage1, top: image1Top, left: Math.round((totalWidth - image1Width) / 2) },
      { input: textBuffer, top: totalHeight - textHeightPixels - image1Bottom, left: Math.round((totalWidth - canvas.width) / 2) }
    ])
    .toBuffer();

    // Save the final image buffer to a file
    await sharp(finalImageBuffer).toFile('output.png');
    console.log('Image has been created successfully.');
  } catch (err) {
    console.error('Error creating image:', err);
  }
})();
