const sharp = require("sharp");

const putProcessImage = async (req, res, next) => {
    if (req.file) {
      const { buffer, originalname } = req.file;
      const timestamp = Date.now();
      const ref = `${timestamp}-${originalname}.webp`;
  
      try {
        await sharp(buffer)
          .resize({ width: 485 })
          .webp({ quality: 20 })
          .toFile("./images/" + ref);
        req.file.link = ref;
      } catch (error) {
        return res.status(500).json({ error: "Erreur compression image" });
      }
    }
    
    next();
  };
  
  module.exports = putProcessImage;