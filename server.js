const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const generateImage = require('./imageGenerator');

const app = express();
const PORT = process.env.PORT || 4000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate-image', upload.fields([{ name: 'image1' }, { name: 'image2' },{ name: 'image3' }]), (req, res) => {
  const text1 = req.body.text1;
  const imagePath1 = req.files['image1'][0].path;
  const imagePath2 = req.files['image2'][0].path;
  const imagePath3 = req.files['image3'][0].path;

  generateImage(imagePath1, imagePath2, text1, imagePath3)
    .then(buffer => {
      // You might want to use a unique name for each output image
      const outputPath = 'output/generated-image.png';
      fs.writeFileSync(outputPath, buffer);
      res.sendFile(path.join(__dirname, outputPath));
    })
    .catch(err => {
      console.error('Error creating image:', err);
      res.status(500).send('An error occurred while generating the image.');
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
