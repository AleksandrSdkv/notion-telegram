import dotenv from 'dotenv';

import { Markup, Context, Scenes, session, Telegraf } from 'telegraf';
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
  { command: 'create', description: 'Создать новый заказ' },
]);
const foundPerson = (ctx) => {
  const found = personal.find(
    (person) => person.name.toLowerCase() === ctx.toLowerCase(),
  );
  return found;
};

// Создание сцены
const multiMessageScene = new BaseScene('multiMessageScene');

multiMessageScene.hears('Выйти', (ctx) => {
  ctx.reply('Отмена создания!');
  ctx.scene.leave();
});

multiMessageScene.enter((ctx) => {
  ctx.session.messages = {};
  ctx.reply(
    'Выберите заявителя:',
    Markup.keyboard([['Aleksandr', 'Vladimir'], ['Выйти']])
      .resize()
      .oneTime(),
  );
});

// Обработка текстовых сообщений
multiMessageScene.on(message('text'), async (ctx, next) => {
  const person = foundPerson(ctx.message.text);
  if (!person) {
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. К сожалению вы слабое звено!`,
    );
    ctx.scene.leave();
    return;
  }
  if (person) {
    ctx.session.messages['Утверждающий'] = {
      people: [
        {
          id: person.id,
        },
      ],
    };
  }
  return next();
});

multiMessageScene.on(message('text'), async (ctx, next) => {
  await ctx.reply(
    `Привет ${ctx.message.text}. Пожалуйста, введите поле "Наименование" (пример: "Стул"):`,
  );
  return next();
});

multiMessageScene.on(message('text'), async (ctx, next) => {
  console.log('ctx.session.text');

  ctx.session.messages['Наименование'] = {
    title: [
      {
        text: {
          content: ctx.session.text,
        },
      },
    ],
  };

  console.log(ctx.session.messages);
  return next();
});
// Инициализация Stage и добавление сцены
const stage = new Stage([multiMessageScene]);

// Подключение middleware для сессий и сцен
bot.use(session());
bot.use(stage.middleware());

// Команда для запуска сцены
bot.command('create', (ctx) => {
  ctx.scene.enter('multiMessageScene');
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
