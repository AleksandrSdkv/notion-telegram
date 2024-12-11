import { Telegraf, session } from 'telegraf';
import { registrationWizard } from './wizardScene/index.js';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'create', description: 'Создать новый заказ' },
]);

bot.use(session());
bot.use(registrationWizard);

bot.command('create', (ctx) => ctx.scene.enter('registration-wizard'));

bot
  .launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((err) => console.error('Ошибка при запуске бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
