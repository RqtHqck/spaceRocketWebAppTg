Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('winston'), createLogger = _a.createLogger, format = _a.format, transports = _a.transports;
// Конфигурация логгера
var logger = createLogger({
    level: 'info', // минимальный уровень логирования
    format: format.combine(format.timestamp(), format.json() // Формат логов в JSON
    ),
    transports: [
        new transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            format: format.json(),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false
        }),
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: format.combine(format.colorize(), format.simple()),
        })
    ],
    exitOnError: false, // Не завершать процесс при ошибке
});
// Поток для использования с morgan
logger.stream = {
    write: function (message) {
        // Убираем возможные проблемы с передачей строки в log
        logger.info({ message: message.trim() });
    }
};
exports.default = logger;
