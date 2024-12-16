import { Telegraf, session } from 'telegraf';
import { registrationWizard } from './wizardScene/index.js';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(registrationWizard);

bot.command('create', (ctx) => console.log(ctx.message));
bot.on(['document', 'photo'], (ctx) => {
  ctx.reply('📁 Файл получен! Запускаю процесс...');
  ctx.scene.enter('registration-wizard');
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
bot
  .launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((err) => console.error('Ошибка при запуске бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
