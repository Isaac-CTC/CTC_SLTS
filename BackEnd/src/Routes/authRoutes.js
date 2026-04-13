const express = require('express');
const authController = require('../Controllers/authControllers.js');
const authenticateToken = require('../Middleware/authenticateToken.js');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;