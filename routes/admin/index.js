const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/adminController');

router.post('/signup', adminController.signup);

router.post('/login', adminController.login);

router.get('/protected', adminController.get_protected);

module.exports = router;
