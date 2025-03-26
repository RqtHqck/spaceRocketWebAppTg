const ApiError = require("../errors/ApiError");
const logger = require('../utils/logger');


const ErrorHandler = (error, req, res, next) => {
    if (error instanceof ApiError) {
        // Логируем API ошибку
        logger.error(`API Error in ${req.method} ${req.originalUrl}: ${error.code || 'UNKNOWN_ERROR'} - ${error.message}\n///Error trace: ${error.stack ? error.stack : ''}`);

        // Отправляем ответ с ошибкой
        res.status(error.status).json({
            success: false,
            error: {
                status: error.status,
                code: error.code,
                message: error.message,
                details: error.details
            },
        });
        return; // Завершаем выполнение
    }

    // Логируем неожиданную ошибку
    logger.error(`Uncaught Error in ${req.method} ${req.originalUrl}:: ${error.code || 'UNKNOWN_ERROR'} - ${error.message}\\\Error trace: ${error.stack ? error.stack : ''}`);

    // Отправляем ответ с внутренней ошибкой сервера
    res.status(500).json({
        success: false,
        error: {
            status: error.status,
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
            details: error.details
        },
    });
    return; // Завершаем выполнение
};

module.exports = ErrorHandler;
