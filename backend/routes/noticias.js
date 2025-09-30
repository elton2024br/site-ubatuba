const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');
const { authenticate, canEdit, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', noticiasController.list);

// Rotas protegidas (admin/editor) - Formato simplificado para o painel admin
router.post('/', authenticate, canEdit, noticiasController.create);
router.put('/:id', authenticate, canEdit, noticiasController.update);
router.delete('/:id', authenticate, isAdmin, noticiasController.delete);
router.get('/:id', authenticate, canEdit, noticiasController.getById);

// Rotas alternativas com prefixo /admin (mantidas para compatibilidade)
router.get('/admin/todas', authenticate, canEdit, noticiasController.listAll);
router.get('/admin/detalhes/:id', authenticate, canEdit, noticiasController.getById);
router.post('/admin/criar', authenticate, canEdit, noticiasController.create);
router.put('/admin/atualizar/:id', authenticate, canEdit, noticiasController.update);
router.delete('/admin/deletar/:id', authenticate, isAdmin, noticiasController.delete);

// Rota pública para slug (deve ficar por último para não conflitar com :id)
router.get('/slug/:slug', noticiasController.getBySlug);

module.exports = router;
