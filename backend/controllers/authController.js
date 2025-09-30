const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario-supabase');
const config = require('../config/config');

// Login
exports.login = async (req, res) => {
    try {
        console.log('🔐 Tentativa de login recebida');
        console.log('   Body:', { email: req.body?.email, senha: req.body?.senha ? '***' : 'undefined' });

        const { email, senha } = req.body;

        // Validação de entrada
        if (!email || !senha) {
            console.log('❌ Dados obrigatórios faltando:', { email: !!email, senha: !!senha });
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        console.log('📧 Buscando usuário por email:', email);
        const user = await Usuario.findByEmail(email);

        if (!user) {
            console.log('❌ Usuário não encontrado para email:', email);
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        console.log('✅ Usuário encontrado:', { id: user.id, nome: user.nome, email: user.email, ativo: user.ativo });

        if (!user.ativo) {
            console.log('❌ Usuário inativo:', user.email);
            return res.status(401).json({
                success: false,
                message: 'Usuário inativo'
            });
        }

        console.log('🔑 Verificando senha...');
        const isValidPassword = await Usuario.verifyPassword(senha, user.senha);

        if (!isValidPassword) {
            console.log('❌ Senha inválida para usuário:', email);
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        console.log('✅ Senha válida, gerando token JWT...');
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRE }
        );

        console.log('✅ Login bem-sucedido para:', email);
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
        console.error('💥 Erro no login:', error);
        console.error('   Stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
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
