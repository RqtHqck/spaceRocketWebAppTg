require('../config/dotenv.js');
const logger = require('../utils/logger')
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
logger.info('Bot was created and started.')

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    logger.info(`Message got from user with chatId:${chatId} with text:${text}`);

    if (text === '/start') {
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🚀 Открыть приложение", web_app: { url: process.env.WEB_APP_URL } }]
                ],
            }
        };
        responseText = "🔗 Приветствую в моём приложении 🚀SpaceRocket! Нажмите кнопку, чтобы открыть приложение:"
        logger.info(`Message sent to user with chatId:${chatId} with text:${responseText}`);

        bot.sendMessage(
          chatId,
          responseText,
          { reply_markup: keyboard.reply_markup });
    }
});


bot.on('polling_error', (error) => {
  console.log(`[polling_error] ${error.code}: ${error.message}`);
});


module.exports = bot;