const { query } = require('../config/database-simple');
const crypto = require('crypto');

class Newsletter {
    // Listar todos os inscritos
    static findAll(filters = {}) {
        let subscribers = query.all('newsletter');

        if (filters.confirmado !== undefined) {
            subscribers = subscribers.filter(s => s.confirmado === filters.confirmado);
        }

        return subscribers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Buscar por email
    static findByEmail(email) {
        return query.get('newsletter', s => s.email === email);
    }

    // Inscrever
    static subscribe(email) {
        const exists = this.findByEmail(email);
        
        if (exists) {
            return { alreadyExists: true, email: exists.email, confirmado: exists.confirmado };
        }

        const token = crypto.randomBytes(32).toString('hex');
        
        const newSubscriber = query.insert('newsletter', {
            email,
            token,
            confirmado: false
        });

        return { id: newSubscriber.id, email, token };
    }

    // Confirmar inscrição
    static confirm(token) {
        const subscriber = query.get('newsletter', s => s.token === token);
        
        if (!subscriber) {
            return null;
        }

        query.update('newsletter', subscriber.id, {
            confirmado: true,
            token: null
        });
        
        return this.findByEmail(subscriber.email);
    }

    // Cancelar inscrição
    static unsubscribe(email) {
        const subscriber = this.findByEmail(email);
        if (subscriber) {
            return query.delete('newsletter', subscriber.id);
        }
        return false;
    }

    // Contar inscritos
    static count() {
        return query.count('newsletter', s => s.confirmado === true);
    }
}

module.exports = Newsletter;
