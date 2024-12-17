import { Telegraf, session } from 'telegraf';
import { registrationWizard } from './wizardScene/index.js';
import { personal } from './constants/data.js';

import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(registrationWizard);

// bot.command('create', (ctx) => console.log(ctx.update));

bot.on(['document', 'photo'], (ctx) => {
  const currentUser = personal.find(
    (person) => person.idTelegram === ctx.message.from.id,
  );
  if (currentUser) {
    try {
      ctx.reply('📁 Файл получен! Запускаю процесс...');
      ctx.scene.enter('registration-wizard');
    } catch (e) {
      console.log(e);
      ctx.reply(
        'Проблема с отправкой файла, попробуйте отправить файл ещё раз',
      );
    }
  }
  if (!currentUser) ctx.reply('Ошибка авторизации, запросите доступ');
});
bot.start((ctx) =>
  ctx.reply(`Привет ${ctx.message.from.first_name}
Это бот для создания заявок. Для получения информации о командах нажмите /help
Для создания заявки отправьте файл`),
);
bot.help((ctx) =>
  ctx.reply(
    `При отправке заявки могут возникнуть ошибки в случае неправильного написания. При возникновении ошибки после отправки файла с счетом, файл в любом случае будет отправлен на яндекс диск и его нужно будет удалить.`,
  ),
);
bot.command('register', (ctx) => {
  const userId = 935902425; // Александр ID
  const message = JSON.stringify(ctx.update.message.from, null, 2);

  bot.telegram
    .sendMessage(userId, message)
    .then(() => {
      console.log('Сообщение отправлено');
      ctx.reply('Ваш запрос был успешно обработан.');
    })
    .catch((err) => {
      console.error('Ошибка при отправке сообщения:', err);
      ctx.reply('Произошла ошибка при отправке сообщения.');
    });
});

bot
  .launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((err) => console.error('Ошибка при запуске бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
