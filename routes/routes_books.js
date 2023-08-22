const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const processImage = require('../middleware/processImage');
const checkFile = require('../middleware/checkFile');
const router = express.Router();
const bookCtrl = require('../controllers/controllers_books');

router.get('/bestrating', bookCtrl.bestRatingBook);
router.post('/', auth, multer, checkFile, processImage, bookCtrl.createBook);
router.put('/:id', auth, multer, processImage, bookCtrl.modifyBook); 
router.delete('/:id', auth, bookCtrl.deleteBook);   
router.post('/:id/rating', auth, bookCtrl.ratingOneBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);

module.exports = router;