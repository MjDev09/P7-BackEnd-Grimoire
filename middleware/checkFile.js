const checkFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Pas de fichier téléchargé trouvé" });
    }
    next();
}

module.exports = checkFile