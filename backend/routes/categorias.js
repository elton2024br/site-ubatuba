const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', categoriasController.list);
router.get('/:slug', categoriasController.getBySlug);

// Rotas protegidas (admin)
router.post('/', authenticate, isAdmin, categoriasController.create);
router.put('/:id', authenticate, isAdmin, categoriasController.update);
router.delete('/:id', authenticate, isAdmin, categoriasController.delete);

module.exports = router;
