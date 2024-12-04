import dotenv from 'dotenv';
import { Telegraf, session, Markup } from 'telegraf';
import { BaseScene, Stage } from 'telegraf/scenes';
import { createNewGroup, getListLength } from './notion.js';
import { personal } from './data.js';
import { message } from 'telegraf/filters';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 30000,
});
bot.telegram.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'Get help' },
]);
const properties = {
  Наименование: {
    title: [
      {
        text: {
          content: 'Стул',
        },
      },
    ],
  },
};
bot.use((ctx, next) => {
  console.log('Следующий обработчик вызван!');
  return next();
});
bot.use((ctx, next) => {
  console.log('Еще один следующий обработчик вызван!');
  next();
});
bot.command('Hello', (ctx, next) => {
  console.log('hello');
  return ctx.reply('Hello-hello').then(() => next());
});

bot.action('Aleksandr', async (ctx) => {
  ctx.reply('действие');
});
bot.start(async (ctx) => {
  await ctx.reply(
    'Выбери действие',
    Markup.inlineKeyboard([Markup.button.callback('Aleksandr', 'Aleksandr')]),
  );
});
// bot.on(message('text'), (ctx) => {
//   const found = personal.find(
//     (person) => person.name.toLowerCase() === ctx.message.text.toLowerCase(),
//   );
//   if (found) {
//     properties['Утверждающий'] = {
//       people: [
//         {
//           id: found.id,
//         },
//       ],
//     };
//   }
//   console.log(properties);
// });

bot.hears('Заполнить заявку', async (ctx) => {
  await ctx.reply('Имя заполнителя', Markup.keyboard([`Aleksandr`]).resize());
});

bot.hears('Удалить заявку', async (ctx) => {
  ctx.reply('Имя заполнителя', Markup.keyboard([`Заполнить заявку`]).resize());
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
