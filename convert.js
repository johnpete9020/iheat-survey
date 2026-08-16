const fs = require('fs');
const sharp = require('sharp');

// Ensure this matches the path to your images folder
const dir = 'C:/Users/Jonathan/Desktop/Questionnaire/nutrition-survey/public/assets/';

fs.readdirSync(dir).forEach(file => {
  // Look for all PNG, JPG, or JPEG files
  if (file.match(/\.(png|jpg|jpeg)$/i)) {
    const newName = file.replace(/\.[^/.]+$/, ".webp");
    
    sharp(dir + file)
      .webp({ quality: 80 }) // 80 is the perfect balance of tiny file size and high quality
      .toFile(dir + newName)
      .then(() => console.log(`✅ Converted: ${file} -> ${newName}`))
      .catch(err => console.error(`❌ Error converting ${file}:`, err));
  }
});