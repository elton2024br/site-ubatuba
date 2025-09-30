const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/inscrever', newsletterController.subscribe);
router.get('/confirmar/:token', newsletterController.confirm);
router.post('/cancelar', newsletterController.unsubscribe);

// Rotas protegidas (admin)
router.get('/admin/listar', authenticate, isAdmin, newsletterController.list);

module.exports = router;
