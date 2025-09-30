const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Usuario = require('../models/Usuario-supabase');

// Verificar se o usuário está autenticado
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token não fornecido' 
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Buscar usuário no Supabase
        const user = await Usuario.findById(decoded.id);
        
        if (!user || !user.ativo) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuário não encontrado ou inativo' 
            });
        }

        // Remover senha do objeto
        const { senha, ...userWithoutPassword } = user;
        
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token inválido ou expirado' 
        });
    }
};

// Verificar se o usuário é admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Apenas administradores.' 
        });
    }
    next();
};

// Verificar se o usuário pode editar (admin ou editor)
const canEdit = (req, res, next) => {
    if (!['admin', 'editor'].includes(req.user.role)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Permissão insuficiente.' 
        });
    }
    next();
};

module.exports = { authenticate, isAdmin, canEdit };