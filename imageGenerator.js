const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');

// Register the custom fonts
const fontPathRaleway = './Raleway-Regular.ttf';
const fontPathOpenSans = './OpenSans-Regular.ttf';
registerFont(fontPathRaleway, { family: 'Raleway' });
registerFont(fontPathOpenSans, { family: 'OpenSans' });

const dpi = 300;
const cmToPixel = (cm) => Math.round(cm * (dpi / 2.54));

// Function to generate the image
function generateImage(image1Path, image2Path, text1, text2) {
  // Define the total dimensions of the final image
  const totalWidth = cmToPixel(24.2);
  const totalHeight = cmToPixel(17);
  
  // ... rest of your constants and calculations ...

// Calculate positions and dimensions based on the final image size
const image1Top = cmToPixel(1.5); // Image 1's top offset
const image1Height = cmToPixel(12.1); // Cropped height for Image 1
const image1Width = cmToPixel(11.4); // Cropped width for Image 1
// Define QR code dimensions
const qrCodeSize = cmToPixel(1); // 1x1 cm

    // Calculate the left offset for Image 1 to be 8 cm from the right border
    const image1Left = totalWidth - image1Width - cmToPixel(3);

    
const image2OriginalHeight = totalHeight - (image1Top * 1.8)-200; // Image 2's original height
const image2Aspect = 1 / 9.5; // Aspect ratio for Image 2
const image2OriginalWidth = Math.round(image2OriginalHeight * image2Aspect); // Image 2's original width

// Scale down Image 2 by 2 units
const image2Height = Math.round(image2OriginalHeight / 1.5);
const image2Width = Math.round(image2OriginalWidth / 1.5);
const image2Top = Math.round((totalHeight - image2Height) / 2)-100; // Center Image 2 vertically

// Text properties
const scorpioFontSize = 90; // Font size for the text "Scorpio"
const additionalFontSize = 70; // Font size for the additional text "With love from Artefax"



  const canvas = createCanvas(totalWidth, totalHeight);
  const ctx = canvas.getContext('2d');

  // ... your existing logic to draw on the canvas ...
  // Draw the text "Scorpio" on the canvas
  
ctx.font = `${scorpioFontSize}px 'Raleway'`;
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'bottom';
//ctx.fillText('cancer', totalWidth / 2, totalHeight - cmToPixel(3)); // 3cm above the bottom
ctx.fillText('engines of empowerment', (image1Left) + (image1Width / 2), totalHeight - cmToPixel(1.5)); // Adjusted for center of Image 1

// Draw the additional text "With love from Artefax" below "Scorpio"
// ctx.font = `${additionalFontSize}px 'OpenSans'`;
// //ctx.fillText('with love from Artefax', totalWidth / 2, totalHeight - cmToPixel(2)); // 1cm above the bottom
// ctx.fillText('this is the text area. this is the text area', (image1Left)+ (image1Width / 2), totalHeight - cmToPixel(0.8)); // Adjusted for center of Image 1

// Convert canvas to buffer for the text
const textBuffer = canvas.toBuffer('image/png');

  // Return a Promise that handles the image processing
  return new Promise(async (resolve, reject) => {
    try {
      // Resize and process images with sharp
      const processedImage1 = await sharp(image1Path).resize(/* ... */).toBuffer();
      const processedImage2 = await sharp(image2Path).resize(/* ... */).toBuffer();

      // ... more of your sharp logic ...

      const finalImageBuffer = await sharp({
        create: {
          width: totalWidth,
          height: totalHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
      .png()
      .composite([
        { input: processedImage2, top: image2Top, left: Math.round((image2Width) / 0.3)-150 }, // Image 2 is on the complete left and scaled down
        { input: processedImage1, top: image1Top, left: image1Left}, // Image 1 is centered horizontally
        // { input: qrCodeImage, top: image2Top*4, left: qrCodeLeft }, // QR code positioned
  
        { input: canvas.toBuffer(), top: -50, left: 0 } 
       // { input: , top: 0, left: 0 }
      ])
      .toBuffer();

      resolve(finalImageBuffer);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateImage;
