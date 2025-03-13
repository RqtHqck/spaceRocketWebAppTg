require('../config/dotenv.js');
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
console.log('Bot has been created.')

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🚀 Открыть приложение", web_app: { url: process.env.WEB_APP_URL } }]
                ],
            }
        };

        bot.sendMessage(chatId, "🔗 Нажмите кнопку, чтобы открыть приложение:", keyboard);
    }
});


bot.on('polling_error', (error) => {
  console.log(`[polling_error] ${error.code}: ${error.message}`);
});
