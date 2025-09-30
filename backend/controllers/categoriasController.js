const Categoria = require('../models/Categoria-supabase');

// Listar categorias
exports.list = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();

        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar categorias',
            error: error.message
        });
    }
};

// Obter categoria por slug
exports.getBySlug = async (req, res) => {
    try {
        const categoria = await Categoria.findBySlug(req.params.slug);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada'
            });
        }

        res.json({
            success: true,
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar categoria',
            error: error.message
        });
    }
};

// Criar categoria (admin)
exports.create = async (req, res) => {
    try {
        const { nome, cor, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({
                success: false,
                message: 'Nome é obrigatório'
            });
        }

        const categoria = await Categoria.create({ nome, cor, descricao });

        res.status(201).json({
            success: true,
            message: 'Categoria criada com sucesso',
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao criar categoria',
            error: error.message
        });
    }
};

// Atualizar categoria (admin)
exports.update = async (req, res) => {
    try {
        const categoria = await Categoria.update(req.params.id, req.body);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Categoria atualizada com sucesso',
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar categoria',
            error: error.message
        });
    }
};

// Deletar categoria (admin)
exports.delete = async (req, res) => {
    try {
        await Categoria.delete(req.params.id);

        res.json({
            success: true,
            message: 'Categoria deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar categoria',
            error: error.message
        });
    }
};
