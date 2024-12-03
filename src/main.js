import { Telegraf, session } from 'telegraf';
import { BaseScene, Stage } from 'telegraf/scenes';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import { createNewGroup } from './notion.js';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 30000,
});

// bot.start((ctx) => ctx.reply('Hellвфывo!'));
// bot.command('hello', (ctx) =>
//   ctx.reply('Send dasdasd!', {
//     reply_markup: {
//       keyboard: [['Привет']],
//       resize_keyboard: true,
//       one_time_keyboard: true, // Однократное отображение клавиатуры
//     },
//   }),
// );

// Сцена для приёма нескольких сообщений
const multiMessageScene = new BaseScene('multiMessageScene');

// Сцена начинается
multiMessageScene.enter((ctx) => {
  ctx.session.messages = [];
  ctx.reply('Введите первое сообщение:');
});

// Обрабатываем текстовые сообщения
multiMessageScene.on('text', (ctx) => {
  ctx.session.messages.push(ctx.message.text);

  if (ctx.session.messages.length < 3) {
    ctx.reply(
      `Принято сообщение ${ctx.session.messages.length}. Введите ещё ${3 - ctx.session.messages.length}.`,
    );
  } else {
    ctx.reply('Все сообщения получены, передаю дальше...');

    // Пример передачи собранных данных на следующий этап
    ctx.reply(
      `Вот ваши сообщения:\n1. ${ctx.session.messages[0]}\n2. ${ctx.session.messages[1]}\n3. ${ctx.session.messages[2]}`,
    );

    // Завершение сцены
    ctx.scene.leave();
  }
});

// Инициализация Stage и добавление сцены
const stage = new Stage([multiMessageScene]);

bot.use(session()); // Добавление сессии для сохранения состояния пользователя
bot.use(stage.middleware());

// Команда для запуска сцены
bot.command('start', (ctx) => ctx.scene.enter('multiMessageScene'));

// bot.use(async (ctx) => {
//   await ctx.reply('Привет', {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Подбросить ещё раз',
//             callback_data: 'flip_a_coin',
//           },
//         ],
//       ],
//     },
//   });
// });
// bot.use(async (ctx) => {
//   await ctx.reply(
//     'Что нужно сделать?',
//     Markup.keyboard([['Подбросить монетку', 'Случайное число']]).resize(),
//   );
// });

// bot.on(message('text'), (ctx) => createNewGroup(ctx.message.text));
// bot.on("text", (ctx) => ctx.reply(ctx.message.text));

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
