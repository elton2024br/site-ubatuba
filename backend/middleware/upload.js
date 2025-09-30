const multer = require('multer');
const path = require('path');
const config = require('../config/config');

// Configurar storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
    if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Multer 2.x usa MulterError para erros customizados
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

module.exports = upload;