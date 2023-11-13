const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');

// Register the custom fonts
const fontPathRaleway = './Raleway-Regular.ttf'; // Make sure this path is correct
const fontPathOpenSans = './OpenSans-Regular.ttf'; // Make sure this path is correct
registerFont(fontPathRaleway, { family: 'Raleway' });
registerFont(fontPathOpenSans, { family: 'OpenSans' });

// Define the paths to your images
const image2Path = './MoleculeLogoV8.png';
const image1Path = './zodiacPrint.png';

// Define dimensions in pixels, assuming a DPI of 300 for print-quality images
const dpi = 300;
const cmToPixel = (cm) => Math.round(cm * (dpi / 2.54));

// Define the total dimensions of the final image (19cm by 15cm)
const totalWidth = cmToPixel(22);
const totalHeight = cmToPixel(19.2);

// Adjust positions and dimensions based on the new final image size
const image1Top = cmToPixel(2.5);
// const image1Height = cmToPixel(12.1); // Cropped height for Image 1
// const image1Width = cmToPixel(11.4); // Cropped width for Image 1

const image1Height = Math.round(totalHeight * 0.65);
const image1Width = image1Height-40;
// const image1Left = totalWidth - image1Width - cmToPixel(1.7);

    // Calculate the left offset for Image 1 to be 8 cm from the right border
    const image1Left = totalWidth - image1Width - cmToPixel(2);
    
const image2OriginalHeight = totalHeight - (image1Top * 2.3)-150; // Image 2's original height
const image2Aspect = 1 / 9.5; // Aspect ratio for Image 2
const image2OriginalWidth = Math.round(image2OriginalHeight * image2Aspect); // Image 2's original width


// const image2OriginalHeight = Math.round(totalHeight * 0.4);
// const image2Aspect = 1 / 5.5;
// const image2OriginalWidth = Math.round(image2OriginalHeight * image2Aspect);
const image2Height = Math.round(image2OriginalHeight / 1.5);
const image2Width = Math.round(image2OriginalWidth / 1.5);
const image2Top = Math.round((totalHeight - image2Height) / 2);
const image2Left = Math.round((totalWidth - image2Width) / 2);

// Adjust text properties
// const scorpioFontSize = 70;
// const additionalFontSize = 40;
const scorpioFontSize = 120; // Font size for the text "Scorpio"
const additionalFontSize = 70; // Font size for the additional text "With love from Artefax"

// Create a canvas to draw text on
const canvas = createCanvas(totalWidth, totalHeight);
const ctx = canvas.getContext('2d');

// Draw the text "Scorpio" on the canvas
ctx.font = `${scorpioFontSize}px 'Raleway'`;
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'bottom';
// ctx.fillText('Scorpio', (image1Left + image1Width / 2), totalHeight - cmToPixel(1.5));
ctx.fillText('cancer', (image1Left) + (image1Width / 2), totalHeight - cmToPixel(1.7)); // Adjusted for center of Image 1


// Draw the additional text "With love from Artefax"
ctx.font = `${additionalFontSize}px 'OpenSans'`;
ctx.fillText('this is the text area. this is the text area', (image1Left)+ (image1Width / 2), totalHeight - cmToPixel(0.8)); // Adjusted for center of Image 1

// Convert canvas to buffer for the text
const textBuffer = canvas.toBuffer('image/png');

(async () => {
  try {
    // Resize and process images
    const processedImage2 = await sharp(image2Path)
      .resize(image2Width+100, image2Height)
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
    .tiff() // Output format changed to PNG
    .composite([
      { input: processedImage2, top: image2Top, left: Math.round((image2Width) / 0.8) }, // Image 2 is on the complete left and scaled down
      { input: processedImage1, top: image1Top, left: image1Left-180}, // Image 1 is centered horizontally
      { input: textBuffer, top: -40, left: -200 }
    ])
    .toFile('puregaurd 650ml bottle print file.tiff'); // Save as PNG

    console.log('Image has been created successfully.');
  } catch (err) {
    console.error('Error creating image:', err);
  }
})();
