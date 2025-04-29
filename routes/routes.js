const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const configurarStorage = (dbType) => {
    const uploadDir = path.join(process.env.UPLOAD_PATH, dbType);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
};

const configurarRutas = (router, controller, dbType) => {
    const storage = configurarStorage(dbType);
    const upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
        fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|gif|webp/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
            }
        }
    });

    router.post('/', upload.single('caratula'), controller.createCancion);
    router.get('/', controller.getAllCanciones);
    router.get('/:id', controller.getCancionById);
    router.put('/:id', upload.single('caratula'), controller.updateCancion);
    router.delete('/:id', controller.deleteCancion);

    return router;
};

module.exports = {
    configurarRutas
};