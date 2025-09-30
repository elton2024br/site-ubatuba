// Banco de dados simples em memória (JSON)
// Substitua por SQLite real em produção

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.json');

// Estrutura inicial do banco
let db = {
    usuarios: [],
    categorias: [],
    noticias: [],
    newsletter: [],
    comentarios: [],
    analytics: []
};

// Carregar dados do arquivo (se existir)
function loadData() {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            db = JSON.parse(data);
            console.log('✅ Banco de dados carregado');
        }
    } catch (error) {
        console.error('Erro ao carregar banco:', error);
    }
}

// Salvar dados no arquivo
function saveData() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('Erro ao salvar banco:', error);
    }
}

// Auto-save a cada mudança
const autoSave = () => {
    saveData();
};

// Funções auxiliares
const query = {
    // SELECT
    all: (table, filter = () => true) => {
        return db[table].filter(filter);
    },
    
    // SELECT WHERE
    get: (table, filter) => {
        return db[table].find(filter);
    },
    
    // INSERT
    insert: (table, data) => {
        const id = db[table].length > 0 
            ? Math.max(...db[table].map(item => item.id || 0)) + 1 
            : 1;
        const newItem = { id, ...data, created_at: new Date().toISOString() };
        db[table].push(newItem);
        autoSave();
        return newItem;
    },
    
    // UPDATE
    update: (table, id, data) => {
        const index = db[table].findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            db[table][index] = { 
                ...db[table][index], 
                ...data, 
                updated_at: new Date().toISOString() 
            };
            autoSave();
            return db[table][index];
        }
        return null;
    },
    
    // DELETE
    delete: (table, id) => {
        const index = db[table].findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            db[table].splice(index, 1);
            autoSave();
            return true;
        }
        return false;
    },
    
    // COUNT
    count: (table, filter = () => true) => {
        return db[table].filter(filter).length;
    }
};

function initDatabase() {
    loadData();
    console.log('✅ Banco de dados inicializado (JSON)');
}

module.exports = { db, query, initDatabase, saveData };
