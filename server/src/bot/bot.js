require('@config/dotenv.js');
const logger = require('@utils/logger');
const TelegramBot = require('node-telegram-bot-api');
const keyboard = require('./keyboards/inline/greeting');
const UserService = require('@services/UserService');
const ApiError = require('@errors/ApiError');


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
logger.info('Bot was created and started.')

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
    const tgId = msg.chat.id;
    const text = msg.text;
    logger.info(`Message got from user with {tgId: ${tgId}} with text: ${text}`);

    if (text === '/start') {
        try {
            const user = await UserService.findByTgId(tgId);
            if (!user) {
                await UserService.create({ tgId: tgId })
            }
        } catch (err) {
            throw ApiError.internalError('Error during register user', err);
        }

        responseText = "🔗 Приветствую в 🚀SpaceRocket! Нажмите кнопку, чтобы открыть приложение:"
        logger.info(`Message sent to user with {tgId: ${tgId}} with text: ${text}`);

        bot.sendMessage(
          tgId,
          responseText,
          { reply_markup: keyboard.reply_markup });
    }
});


bot.on('polling_error', (error) => {
  console.log(`[polling_error] ${error.code}: ${error.message}`);
});


module.exports = bot;