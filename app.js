const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const sharp = require('sharp');
const bodyParser = require('body-parser');

const app = express();

// Define storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register fonts
// ... (same as your script)


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS setup
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index'); // The form page
});

app.post('/generate-image', upload.fields([{name: 'image1'}, {name: 'image2'}]), (req, res) => {
  // Extract texts
  const text1 = req.body.text1;
  const text2 = req.body.text2;

  // Path for uploaded images
  const imagePath1 = req.files['image1'][0].path;
  const imagePath2 = req.files['image2'][0].path;

  // ... (same logic as your script for image processing)

  // Once the image is created, send a response to the client
  // For example, you could redirect to a route that serves the final image
  res.redirect('/final-image');
});

app.get('/final-image', (req, res) => {
  // Serve the final image (adjust the file path as needed)
  res.sendFile(path.join(__dirname, 'yantralive/output/engines_of_empowerment.png'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
