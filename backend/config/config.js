module.exports = {
    // Servidor
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'ubatuba_reage_secret_2025_mude_em_producao',
    JWT_EXPIRE: '7d',
    
    // Admin padrão
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@ubatubareage.com.br',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    
    // Upload
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    UPLOAD_PATH: './public/uploads',
    
    // URLs
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5500',
    
    // Paginação
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
};
