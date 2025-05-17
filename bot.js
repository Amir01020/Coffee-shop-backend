import TelegramBot from 'node-telegram-bot-api';

const token = '7881561415:AAHpzV4qHGP_3qq9HsWjt5ve7fE5ZHdhBaM'; // Ваш токен
const groupChatId = -1002405084070; // ID вашей группы

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  // Игнорируем сообщения из самой целевой группы
  if (msg.chat.id === groupChatId) return;
  
  // Игнорируем команды (сообщения, начинающиеся с /)
  if (msg.text && msg.text.startsWith('/')) return;

  // Формируем информацию об отправителе
  const from = msg.from?.username || 
              `${msg.from?.first_name}${msg.from?.last_name ? ' ' + msg.from.last_name : ''}` || 
              'Аноним';
  
  // Формируем текст сообщения
  let messageText = `📩 Новое заказ:\n\n`;
  
  if (msg.text) {
    messageText += msg.text;
  } else if (msg.photo) {
    messageText += '[Фото]';
  } else if (msg.video) {
    messageText += '[Видео]';
  } else if (msg.document) {
    messageText += `[Документ: ${msg.document.file_name}]`;
  } else {
    messageText += '[Медиа-сообщение]';
  }

  

  // Пересылаем сообщение в группу
  bot.sendMessage(groupChatId, messageText)
     .catch(err => console.error('Ошибка отправки:', err.message));
});

console.log('Бот запущен и готов пересылать сообщения в группу ' + groupChatId);

// Обработчик ошибок
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code);
});