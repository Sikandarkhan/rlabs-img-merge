const sharp = require('sharp');
const axios = require('axios');
const http = require('http');
const fs = require('fs');


const image1URL = 'https://cdn.discordapp.com/attachments/1094892992281718894/1143836967507865680/rudralabs_AR_Rahman_as_folding_India_country_flag_while_signing_c1f5b633-5eaf-4928-8199-f6d2ea9ebc24.png?width=500&height=500';
const image2Path = './Untitled3.png'; // Use the local path for image2

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Handle requests at the root URL
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Node.js server is running on port 8002');
    } else if (req.url === '/downloadImages') {
        // Handle requests for downloading images
        downloadImages(res);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Downloading and processing images...');
    }
    else if (req.url === '/mergedImage') {
        // Handle requests for serving the merged image
        fs.readFile('./merged-image.png', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Disposition': 'inline; filename=merged-image.webp'
                });
                res.end(data);
            }
        });
    }
    
    
    else {
        // Handle other requests
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

// Listen on port 8002
const port = 8002;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


async function downloadImages(res) {
    try {
        const response1 = await axios.get(image1URL, { responseType: 'arraybuffer' });
        // Use the local path directly for image2
        const image2Buffer = await sharp(image2Path).toBuffer();

        const image1Buffer = Buffer.from(response1.data, 'binary');

        const outputImagePath = './merged-image.png';

        const image1 = sharp(image1Buffer);

        // Get dimensions of image1
        const { width: width1, height: height1 } = await image1.metadata();

        // Calculate composite options for positioning the second image
        const margin = 0;
        const compositeOptions = [
            {
                input: image1Buffer,
                top: 0,
                left: 0,
            },
            {
                input: image2Buffer,
                top: 850,
                left: 0, // Position next to the first image with a margin
            },
        ];

        // Composite the images
        image1.composite(compositeOptions)
            .sharpen()
            .withMetadata()
            // .webp({ quality: 90 })
            // .resize(100)
            
            .toFile(outputImagePath, (err, info) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Merged image saved at', info.path);
                }
            });
    } catch (error) {
        console.error('Error downloading images:', error);
        // res.writeHead(500, { 'Content-Type': 'text/plain' });
        // res.end('Internal Server Error');

    }
}

downloadImages();


// const sharp = require('sharp');
// const axios = require('axios');

// const image1URL = 'https://media.discordapp.net/attachments/1093552218948513912/1140905369942638593/rudralabs_india_celebrating_independance_day_2023_4393435c-8b03-4861-bdda-1781bc81eb57.png?width=355&height=355';
// const image2URL = './Molecule.png';

// async function downloadImages() {
//     try {
//         const response1 = await axios.get(image1URL, { responseType: 'arraybuffer' });
//         const response2 = image2URL;

//         const image1Buffer = Buffer.from(response1.data, 'binary');
//         const image2Buffer = Buffer.from(response2.data, 'binary');

//         const outputImagePath = './merged-image.png';

//         const image1 = sharp(image1Buffer);
//         const image2 = sharp(image2Buffer);

//         // Get dimensions of image1
//       // Get dimensions of image1
//       const { width: width1, height: height1 } = await image1.metadata();
//       const { width: width2, height: height2 } = await image2.metadata();


//          // Calculate composite options for positioning the second image
//          const margin = 0;
//          const compositeOptions = [
//              {
//                  input: image1Buffer,
//                  blend: "over",
//                  top: 0,
//                  left: 0,
                
//              },
//              {
//                  input: image2Buffer,
//                  blend: "over",
//                  top: 100,
//                  left: 50, // Position next to the first image with a margin
               
//              },
//          ];
 
//          // Composite the images
//          image1.composite(compositeOptions)
//          .sharpen()
//          .withMetadata()
//          .webp( { quality: 90 } )
//         //  .resize(100)
//              .toFile(outputImagePath, (err, info) => {
//                  if (err) {
//                      console.error(err);
//                  } else {
//                      console.log('Merged image saved at', info.path);
//                  }
//              });
//     } catch (error) {
//         console.error('Error downloading images:', error);
//     }
// }

// downloadImages();

// // const sharp = require('sharp');
// // const axios = require('axios');

// // const image1URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png';
// // const image2URL = 'https://media.discordapp.net/attachments/1094892992281718894/1141005261251813446/rudralabs_Charminar_next_to_beach_in_hot_summer_e299aa1d-6fbf-47e0-881e-82b2c4095d08.png?width=355&height=355';

// // async function downloadImages() {
// //     try {
// //         const response1 = await axios.get(image1URL, { responseType: 'arraybuffer' });
// //         const response2 = await axios.get(image2URL, { responseType: 'arraybuffer' });

// //         const image1Buffer = Buffer.from(response1.data, 'binary');
// //         const image2Buffer = Buffer.from(response2.data, 'binary');

// //         const outputImagePath = './merged-image.jpg';

// //         sharp(image1Buffer)
// //             .overlayWith(image2Buffer, { gravity: sharp.gravity.center }) // Adjust gravity as needed
// //             .toFile(outputImagePath, (err, info) => {
// //                 if (err) {
// //                     console.error(err);
// //                 } else {
// //                     console.log('Merged image saved at', info.path);
// //                 }
// //             });
// //     } catch (error) {
// //         console.error('Error downloading images:', error);
// //     }
// // }

// // downloadImages();
