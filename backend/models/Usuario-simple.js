const { query } = require('../config/database-simple');
const bcrypt = require('bcryptjs');

class Usuario {
    // Buscar por email
    static findByEmail(email) {
        return query.get('usuarios', u => u.email === email);
    }

    // Buscar por ID
    static findById(id) {
        const user = query.get('usuarios', u => u.id === parseInt(id));
        if (!user) return null;
        // Não retornar senha
        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // Listar todos
    static findAll() {
        return query.all('usuarios').map(({ senha, ...user }) => user);
    }

    // Criar usuário
    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.senha, 10);
        
        const newUser = query.insert('usuarios', {
            nome: data.nome,
            email: data.email,
            senha: hashedPassword,
            role: data.role || 'editor',
            ativo: data.ativo !== undefined ? data.ativo : true
        });

        const { senha, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    // Atualizar usuário
    static async update(id, data) {
        const updateData = {};
        
        if (data.nome) updateData.nome = data.nome;
        if (data.email) updateData.email = data.email;
        if (data.senha) {
            updateData.senha = await bcrypt.hash(data.senha, 10);
        }
        if (data.role) updateData.role = data.role;
        if (data.ativo !== undefined) updateData.ativo = data.ativo;

        const updated = query.update('usuarios', id, updateData);
        if (!updated) return null;
        
        const { senha, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }

    // Verificar senha
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Deletar usuário
    static delete(id) {
        return query.delete('usuarios', id);
    }
}

module.exports = Usuario;
