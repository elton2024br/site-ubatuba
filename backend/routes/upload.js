const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, canEdit } = require('../middleware/auth');
const path = require('path');

// Upload de imagem
router.post('/', authenticate, canEdit, upload.single('imagem'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo enviado'
            });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Arquivo enviado com sucesso',
            data: {
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer upload',
            error: error.message
        });
    }
});

module.exports = router;
