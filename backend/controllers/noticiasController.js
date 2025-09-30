const Noticia = require('../models/Noticia-supabase');
const config = require('../config/config');

// Listar notícias (público)
exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || config.DEFAULT_PAGE_SIZE, config.MAX_PAGE_SIZE);
        const offset = (page - 1) * limit;

        const filters = {
            status: 'publicado',
            categoria: req.query.categoria,
            destaque: req.query.destaque === 'true',
            busca: req.query.busca,
            limit,
            offset
        };

        const noticias = await Noticia.findAll(filters);
        const total = await Noticia.count({ status: 'publicado' });

        res.json({
            success: true,
            data: {
                noticias,
                paginacao: {
                    pagina_atual: page,
                    total_paginas: Math.ceil(total / limit),
                    total_itens: total,
                    itens_por_pagina: limit
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar notícias',
            error: error.message
        });
    }
};

// Obter notícia por slug (público)
exports.getBySlug = async (req, res) => {
    try {
        const noticia = await Noticia.findBySlug(req.params.slug);

        if (!noticia) {
            return res.status(404).json({
                success: false,
                message: 'Notícia não encontrada'
            });
        }

        // Incrementar visualizações
        await Noticia.incrementViews(noticia.id);

        // Buscar notícias relacionadas
        const relacionadas = await Noticia.findRelated(noticia.id, noticia.categoria_id);

        res.json({
            success: true,
            data: {
                noticia: { ...noticia, views: noticia.views + 1 },
                relacionadas
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar notícia',
            error: error.message
        });
    }
};

// Listar todas (admin)
exports.listAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || config.DEFAULT_PAGE_SIZE, config.MAX_PAGE_SIZE);
        const offset = (page - 1) * limit;

        const filters = {
            status: req.query.status,
            categoria: req.query.categoria,
            busca: req.query.busca,
            limit,
            offset
        };

        const noticias = await Noticia.findAll(filters);
        const total = await Noticia.count({ status: req.query.status });

        res.json({
            success: true,
            data: {
                noticias,
                paginacao: {
                    pagina_atual: page,
                    total_paginas: Math.ceil(total / limit),
                    total_itens: total,
                    itens_por_pagina: limit
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar notícias',
            error: error.message
        });
    }
};

// Obter por ID (admin)
exports.getById = async (req, res) => {
    try {
        const noticia = await Noticia.findById(req.params.id);

        if (!noticia) {
            return res.status(404).json({
                success: false,
                message: 'Notícia não encontrada'
            });
        }

        res.json({
            success: true,
            data: noticia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar notícia',
            error: error.message
        });
    }
};

// Criar notícia (admin/editor)
exports.create = async (req, res) => {
    try {
        const { titulo, subtitulo, conteudo, categoria_id, autor, imagem_destaque, status, destaque, tempo_leitura } = req.body;

        if (!titulo || !conteudo || !categoria_id) {
            return res.status(400).json({
                success: false,
                message: 'Título, conteúdo e categoria são obrigatórios'
            });
        }

        // Usar autor_id do usuário logado ou null
        const autor_id = req.user?.id || null;

        const noticia = await Noticia.create({
            titulo,
            subtitulo,
            conteudo,
            categoria_id: parseInt(categoria_id),
            autor_id,
            autor: autor || req.user?.nome || 'Admin',
            imagem_destaque,
            status: status || 'rascunho',
            destaque: destaque || false,
            tempo_leitura: tempo_leitura || 5
        });

        res.status(201).json({
            success: true,
            message: 'Notícia criada com sucesso',
            data: noticia
        });
    } catch (error) {
        console.error('Erro ao criar notícia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar notícia',
            error: error.message
        });
    }
};

// Atualizar notícia (admin/editor)
exports.update = async (req, res) => {
    try {
        const noticia = await Noticia.update(req.params.id, req.body);

        if (!noticia) {
            return res.status(404).json({
                success: false,
                message: 'Notícia não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Notícia atualizada com sucesso',
            data: noticia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar notícia',
            error: error.message
        });
    }
};

// Deletar notícia (admin)
exports.delete = async (req, res) => {
    try {
        await Noticia.delete(req.params.id);

        res.json({
            success: true,
            message: 'Notícia deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar notícia',
            error: error.message
        });
    }
};