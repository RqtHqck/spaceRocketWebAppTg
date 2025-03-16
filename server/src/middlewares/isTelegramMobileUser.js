const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const telegramId = req.headers['x-telegram-id']; // Telegram ID из headers

  // Проверка на мобильное устройство
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (!isMobile) {
    logger.warn(`Access denied from not mobile computer. Redirecting to bot page ${process.env.BOT_WEB_URL}...`);
    return res.redirect(`${process.env.BOT_WEB_URL}`);
  }

  // Проверка на запрос от Telegram
  if (!telegramId) {
    return res.status(403).send('Доступ разрешен только через Telegram WebApp.');
  }

  next();
};
