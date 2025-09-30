const Newsletter = require('../models/Newsletter-supabase');

// Inscrever (público)
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        const result = await Newsletter.subscribe(email);

        if (result.alreadyExists) {
            return res.status(200).json({
                success: true,
                message: result.confirmado 
                    ? 'Este email já está inscrito' 
                    : 'Email já cadastrado, mas aguardando confirmação',
                data: { email: result.email, confirmado: result.confirmado }
            });
        }

        // TODO: Enviar email de confirmação com o token
        
        res.status(201).json({
            success: true,
            message: 'Inscrição realizada! Verifique seu email para confirmar.',
            data: { email: result.email }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao inscrever',
            error: error.message
        });
    }
};

// Confirmar inscrição
exports.confirm = (req, res) => {
    try {
        const { token } = req.params;

        const subscriber = Newsletter.confirm(token);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        res.json({
            success: true,
            message: 'Inscrição confirmada com sucesso!',
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao confirmar inscrição',
            error: error.message
        });
    }
};

// Cancelar inscrição
exports.unsubscribe = (req, res) => {
    try {
        const { email } = req.body;

        Newsletter.unsubscribe(email);

        res.json({
            success: true,
            message: 'Inscrição cancelada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao cancelar inscrição',
            error: error.message
        });
    }
};

// Listar inscritos (admin)
exports.list = async (req, res) => {
    try {
        const confirmado = req.query.confirmado;
        const filters = {};
        
        if (confirmado !== undefined) {
            filters.confirmado = confirmado === 'true';
        }

        const subscribers = await Newsletter.findAll(filters);
        const total = await Newsletter.count();

        res.json({
            success: true,
            data: {
                subscribers,
                total_confirmados: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar inscritos',
            error: error.message
        });
    }
};
