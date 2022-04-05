const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/protected', userController.get_protected);

router.get('/admin', userController.get_admin);

module.exports = router;
