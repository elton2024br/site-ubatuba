const { db } = require('../config/database');
const crypto = require('crypto');

class Newsletter {
    // Listar todos os inscritos
    static findAll(filters = {}) {
        let query = 'SELECT * FROM newsletter WHERE 1=1';
        const params = [];

        if (filters.confirmado !== undefined) {
            query += ' AND confirmado = ?';
            params.push(filters.confirmado ? 1 : 0);
        }

        query += ' ORDER BY created_at DESC';

        return db.prepare(query).all(...params);
    }

    // Buscar por email
    static findByEmail(email) {
        return db.prepare('SELECT * FROM newsletter WHERE email = ?').get(email);
    }

    // Inscrever
    static subscribe(email) {
        const exists = this.findByEmail(email);
        
        if (exists) {
            return { alreadyExists: true, email: exists.email, confirmado: exists.confirmado };
        }

        const token = crypto.randomBytes(32).toString('hex');
        
        const result = db.prepare(`
            INSERT INTO newsletter (email, token, confirmado) 
            VALUES (?, ?, ?)
        `).run(email, token, 0);

        return { id: result.lastInsertRowid, email, token };
    }

    // Confirmar inscrição
    static confirm(token) {
        const subscriber = db.prepare('SELECT * FROM newsletter WHERE token = ?').get(token);
        
        if (!subscriber) {
            return null;
        }

        db.prepare('UPDATE newsletter SET confirmado = 1, token = NULL WHERE id = ?').run(subscriber.id);
        
        return this.findByEmail(subscriber.email);
    }

    // Cancelar inscrição
    static unsubscribe(email) {
        return db.prepare('DELETE FROM newsletter WHERE email = ?').run(email);
    }

    // Contar inscritos
    static count() {
        return db.prepare('SELECT COUNT(*) as total FROM newsletter WHERE confirmado = 1').get().total;
    }
}

module.exports = Newsletter;
