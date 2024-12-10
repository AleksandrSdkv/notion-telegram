import { Telegraf, Scenes, session } from 'telegraf';
import { registrationWizard } from './wizardScene/index.js';
import { personal } from './data.js';
import { createNewGroup } from './notion.js';
import dotenv from 'dotenv';
dotenv.config();

// Инициализация бота
const bot = new Telegraf(process.env.BOT_TOKEN);

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

// Функция для получения ссылки для загрузки файла на Яндекс Диск

//   if (ctx.message.text === 'Выйти') {
//     await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
//     return ctx.scene.leave();
//   }
//   const person = foundPerson(ctx.message.text);
//   if (!person) {
//     await ctx.reply(
//       `Вы выбрали: ${ctx.message.text}. К сожалению сотрудника с таким именем нет! Введите /start, чтобы начать снова.`,
//     );
//     ctx.scene.leave();
//     return;
//   }
//   if (person) {
//     ctx.wizard.state.list['Утверждающий'] = {
//       // Сохраняем имя пользователя
//       people: [
//         {
//           id: person.id,
//         },
//       ],
//     };
//   }

//   if (ctx.message.text === 'Выйти') {
//     await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
//     return ctx.scene.leave();
//   }
//   ctx.wizard.state.user = ctx.message.text;
//   await ctx.reply(
//     `Отлично, ${ctx.message.text}!  Пожалуйста, введите поле "Наименование" (пример: "Стул"):`,
//     Markup.keyboard([[`${key.out}`]])
//       .resize()
//       .oneTime(),
//   );

// Шаг 3: Подтверждение информации
const step3 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
    return ctx.scene.leave();
  }

  ctx.wizard.state.list['Наименование'] = {
    title: [
      {
        text: {
          content: ctx.message.text,
        },
      },
    ],
  };
  ctx.wizard.state.product = ctx.message.text;
  await ctx.reply(
    `Вы выбрали: ${ctx.message.text}. Далее нужно выбрать срочноть заявки`,
    Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
      .resize()
      .oneTime(),
  );
  return ctx.wizard.next(); // Переход к следующему шагу
};

const step4 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
    return ctx.scene.leave();
  }
  if (ctx.message.text === 'Не срочно' && ctx.message.text === 'Срочно') {
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите правильный вариант или нажмите Выйти`,
      Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
        .resize()
        .oneTime(),
    );
  }
  if (ctx.message.text === 'Не срочно') {
    ctx.wizard.state.quickly = ctx.message.text;
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите правильный вариант или нажмите Выйти`,
      Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
        .resize()
        .oneTime(),
    );
    return ctx.wizard.next();
  }
  if (ctx.message.text === 'Срочно') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'Срочно',
      },
    };
    ctx.wizard.state.quickly = ctx.message.text;
  }

  return ctx.wizard.next(); // Переход к следующему шагу
};
const step5 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
    return ctx.scene.leave();
  }

  if (ctx.message.text === 'Срочно') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'Срочно',
      },
    };
    ctx.wizard.state.quickly = ctx.message.text;
  }

  return ctx.wizard.next(); // Переход к следующему шагу
};
const stepСheck = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
    return ctx.scene.leave();
  }

  await ctx.reply(`Отлично! Давай проверим:
  - Имя: ${ctx.wizard.state.user}
  - Наименование: ${ctx.wizard.state.product}
  - Срочность: ${ctx.wizard.state.quickly}
  Всё верно? (да/нет)`);
  return ctx.wizard.next(); // Переход к следующему шагу
};

// Шаг 4: Завершение
const stepConfirmation = async (ctx) => {
  const confirmation = ctx.message.text.toLowerCase();
  if (confirmation === 'да') {
    await ctx.reply('Запрос завершен! 🎉');
    createNewGroup(ctx.wizard.state.list);
    return ctx.scene.leave(); // Завершение сцены
  } else if (confirmation === 'нет') {
    await ctx.reply('Давай начнем сначала. Введи /start.');
    return ctx.scene.leave(); // Завершение сцены
  } else {
    await ctx.reply('Пожалуйста, ответь "да" или "нет".');
  }
};

// Включаем поддержку сессий и сцен
bot.use(session());
bot.use(registrationWizard); // подключаем сцены через stage.middleware()

// Обрабатываем команду /create для запуска сцены
bot.command('create', (ctx) => ctx.scene.enter('registration-wizard'));

bot
  .launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((err) => console.error('Ошибка при запуске бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
