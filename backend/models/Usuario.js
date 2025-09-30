const { query } = require('../config/database-simple');
const bcrypt = require('bcryptjs');

class Usuario {
    // Buscar por email
    static findByEmail(email) {
        return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    }

    // Buscar por ID
    static findById(id) {
        return db.prepare('SELECT id, nome, email, role, ativo, created_at FROM usuarios WHERE id = ?').get(id);
    }

    // Listar todos
    static findAll() {
        return db.prepare('SELECT id, nome, email, role, ativo, created_at FROM usuarios ORDER BY created_at DESC').all();
    }

    // Criar usuário
    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.senha, 10);
        
        const result = db.prepare(`
            INSERT INTO usuarios (nome, email, senha, role, ativo) 
            VALUES (?, ?, ?, ?, ?)
        `).run(
            data.nome,
            data.email,
            hashedPassword,
            data.role || 'editor',
            data.ativo !== undefined ? data.ativo : 1
        );

        return this.findById(result.lastInsertRowid);
    }

    // Atualizar usuário
    static async update(id, data) {
        const fields = [];
        const params = [];

        if (data.nome) {
            fields.push('nome = ?');
            params.push(data.nome);
        }
        if (data.email) {
            fields.push('email = ?');
            params.push(data.email);
        }
        if (data.senha) {
            const hashedPassword = await bcrypt.hash(data.senha, 10);
            fields.push('senha = ?');
            params.push(hashedPassword);
        }
        if (data.role) {
            fields.push('role = ?');
            params.push(data.role);
        }
        if (data.ativo !== undefined) {
            fields.push('ativo = ?');
            params.push(data.ativo ? 1 : 0);
        }

        fields.push('updated_at = ?');
        params.push(new Date().toISOString());
        params.push(id);

        db.prepare(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`).run(...params);

        return this.findById(id);
    }

    // Verificar senha
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Deletar usuário
    static delete(id) {
        return db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
    }
}

module.exports = Usuario;
