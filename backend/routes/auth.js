const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Login
router.post('/login', authController.login);

// Perfil (requer autenticação)
router.get('/perfil', authenticate, authController.getProfile);
router.put('/perfil', authenticate, authController.updateProfile);

module.exports = router;
