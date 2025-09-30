const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario-supabase');
const config = require('../config/config');

// Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        const user = await Usuario.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        if (!user.ativo) {
            return res.status(401).json({
                success: false,
                message: 'Usuário inativo'
            });
        }

        const isValidPassword = await Usuario.verifyPassword(senha, user.senha);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRE }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login',
            error: error.message
        });
    }
};

// Obter perfil do usuário logado
exports.getProfile = (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
};

// Atualizar perfil
exports.updateProfile = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        const updateData = {};
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;
        if (senha) updateData.senha = senha;

        const updatedUser = await Usuario.update(req.user.id, updateData);

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar perfil',
            error: error.message
        });
    }
};
