const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/controllers_users')

router.post('/login', userCtrl.loginUser);

router.post('/signup', userCtrl.createUser);

module.exports = router;