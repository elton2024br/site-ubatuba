const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();
const config = require('./config/config');

// Testar conexão com Supabase
const { supabase } = require('./config/supabase');
console.log('✅ Supabase configurado');

const app = express();

// Middlewares de segurança e otimização
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS - Aceitar todas as origens em desenvolvimento
app.use(cors({
    origin: '*', // Permite qualquer origem (file://, localhost, etc)
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(morgan('combined'));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/upload', require('./routes/upload'));

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Ubatuba Reage está funcionando!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Erro interno do servidor',
        ...(config.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Iniciar servidor (apenas em desenvolvimento local)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    const PORT = config.PORT;
    app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║                                              ║');
        console.log('║       🌊 UBATUBA REAGE - Backend API 🌊      ║');
        console.log('║                                              ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log('');
        console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
        console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
        console.log(`✅ Ambiente: ${config.NODE_ENV}`);
        console.log('');
        console.log('📚 Rotas disponíveis:');
        console.log('   POST   /api/auth/login');
        console.log('   GET    /api/noticias');
        console.log('   GET    /api/noticias/:slug');
        console.log('   GET    /api/categorias');
        console.log('   POST   /api/newsletter/inscrever');
        console.log('');
        console.log('🔐 Rotas admin (requerem autenticação):');
        console.log('   GET    /api/noticias/admin/todas');
        console.log('   POST   /api/noticias/admin/criar');
        console.log('   POST   /api/upload');
        console.log('');
        console.log('💡 Execute "npm run seed" para popular o banco com dados iniciais');
        console.log('');
    });
}

// Exportar app para Vercel (serverless)
module.exports = app;
