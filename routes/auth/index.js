const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController');

router.post('/signup', authController.signup, authController.login); // go ahead and sign user in if successful; no need to make them enter their credentials again

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/session', authController.session);

module.exports = router;
