require('@config/dotenv.js');

module.exports = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Открыть приложение", web_app: { url: process.env.WEB_APP_URL } }]
      ],
    }
  };
}