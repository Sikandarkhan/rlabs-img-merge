const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');

// Register the custom font
// Register the custom fonts
const fontPathAllura = './Allura-Regular.ttf'; // Make sure this path is correct

const fontPathRaleway = './Raleway-Regular.ttf'; // Make sure this path is correct
const fontPathOpenSans = './OpenSans-Regular.ttf'; // Make sure this path is correct
registerFont(fontPathAllura, { family: 'Allura' });
registerFont(fontPathRaleway, { family: 'Raleway' });
// registerFont(fontPathOpenSans, { family: 'OpenSans' });

// Define the paths to your images
const image2Path = './yantralive/new_logo.jpg';
const image1Path = './yantralive/new_beginning.png';
const qrCodePath = './qrCodeImage.png'; // Replace with your QR code image path


// Define dimensions in pixels, assuming a DPI of 300 for print-quality images
const dpi = 300;
const cmToPixel = (cm) => Math.round(cm * (dpi / 2.54));

// Define the total dimensions of the final image
const totalWidth = cmToPixel(24.2);
const totalHeight = cmToPixel(17);

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

// Create a canvas to draw text on
const canvas = createCanvas(totalWidth, totalHeight);
const ctx = canvas.getContext('2d');

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

(async () => {
  try {
    // Resize Image 2 with the new scaled dimensions
    const processedImage2 = await sharp(image2Path)
      .resize(image2Width+200, image2Height)
      .toBuffer();

    // Resize Image 1 and center it horizontally
    const processedImage1 = await sharp(image1Path)
      .resize(image1Width, image1Height)
      .toBuffer();

    //  // Load and resize the QR code
    //  const qrCodeImage = await sharp(qrCodePath)
    //  .resize(qrCodeSize, qrCodeSize)
    //  .toBuffer();

    //     // Calculate the position for the QR code (right below the molecule logo)
    // const qrCodeTop = image2Top + image2Height; // Directly below Image 2
    // const qrCodeLeft = Math.round((image2Width / 0.3) - 150 + (image2Width - qrCodeSize) / 2+125); // Centered below Image 2



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
      { input: processedImage2, top: image2Top, left: Math.round((image2Width) / 0.3)-150 }, // Image 2 is on the complete left and scaled down
      { input: processedImage1, top: image1Top, left: image1Left}, // Image 1 is centered horizontally
      // { input: qrCodeImage, top: image2Top*4, left: qrCodeLeft }, // QR code positioned

      { input: textBuffer, top: -50, left: 0 } // Text canvas covers the entire width
    ])
    .toFile('./yantralive/output/engines_of_empowerment.png');

    console.log('Image has been created successfully.');
  } catch (err) {
    console.error('Error creating image:', err);
  }
})();
