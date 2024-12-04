import dotenv from 'dotenv';
import { Telegraf, session, Markup } from 'telegraf';
import { BaseScene, Stage } from 'telegraf/scenes';
import { createNewGroup, getListLength } from './notion.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 30000,
});

const nonionDatabaseColumnLength = await getListLength();

// https://www.notion.so/messageOne-152bf623c3bc81d0aff0d2ea3eee9dfc URL страницы
// createNewGroup();

// Сцена для приёма нескольких сообщений
const multiMessageScene = new BaseScene('multiMessageScene');

// Сцена начинается
multiMessageScene.enter((ctx) => {
  ctx.session.messages = [];
  ctx.reply('Выберите заявителя:', {
    reply_markup: {
      keyboard: [
        ['Заявитель 1', 'Заявитель 2'],

        ['Заявитель 11', 'Выйти'],
      ],
    },
  });
}),
  multiMessageScene.hears('Выйти', (ctx) => {
    ctx.reply('Free hugs. Call now!');
    ctx.scene.leave();
  });
multiMessageScene.start((ctx) => ctx.reply('Send me any text message!'));
// Обрабатываем текстовые сообщения
multiMessageScene.on('text', async (ctx) => {
  //   ctx.session.messages.push(ctx.message.text);

  //   if (ctx.session.messages.length < 3) {
  //     await ctx.reply(
  //       `Принято сообщение ${ctx.session.messages.length}. Введите ещё ${3 - ctx.session.messages.length}.`,
  //     );
  //   } else {
  //     await ctx.reply('Все сообщения получены, передаю дальше...');

  //     // Пример передачи собранных данных на следующий этап
  //     await createNewGroup(
  //       ctx.session.messages[0],
  //       ctx.session.messages[1],
  //       ctx.session.messages[2],
  //     );

  // Завершение сцены
  ctx.scene.leave();
});

// Инициализация Stage и добавление сцены
const stage = new Stage([multiMessageScene]);

bot.use(session()); // Добавление сессии для сохранения состояния пользователя
bot.use(stage.middleware());

// Команда для запуска сцены
bot.command('start', (ctx) => ctx.scene.enter('multiMessageScene'));

bot.use(async (ctx) => {
  await ctx.reply(
    'Что нужно сделать?',
    Markup.keyboard([['Подбросить монетку', 'Случайное число']])
      .resize()
      .oneTime(),
  );
});

// bot.on(message('text'), (ctx) => createNewGroup(ctx.message.text));
// bot.on('text', (ctx) => ctx.reply(ctx.message.text));

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
