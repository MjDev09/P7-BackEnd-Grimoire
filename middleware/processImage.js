const sharp = require("sharp");

const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Pas de fichier téléchargé trouvé" });
  }
  
    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    const ref = `${timestamp}-${originalname}.webp`;
    
    try {
      await sharp(buffer)
        .resize({ width: 485 })
        .webp({ quality: 20 })
        .toFile("./images/" + ref);
      req.file.link = ref;
      next();
    } catch (error) {
      return res.status(500).json({ error: "Erreur compression image" });
    }
  };

module.exports = processImage;