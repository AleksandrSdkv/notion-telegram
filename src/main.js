import { Telegraf, Scenes, session, Markup } from 'telegraf';
import { personal } from './data.js';
import axios from 'axios';
import fs from 'fs';
import { createNewGroup, getListLength } from './notion.js';
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
const key = {
  out: 'Выйти',
};

// Шаг 1: Запрос имени пользователя
const step1 = async (ctx) => {
  ctx.wizard.state.list = {};
  ctx.reply(
    'Выберите заявителя:',
    Markup.keyboard([['Aleksandr', 'Vladimir'], [`${key.out}`]])
      .resize()
      .oneTime(),
  );
  return ctx.wizard.next(); // Переход к следующему шагу
};

// Шаг 2: Запрос возраста пользователя
const step2 = async (ctx) => {
  const fileId = ctx.message.document.file_id; // Получаем file_id документа
  const fileName = ctx.message.document.file_name; // Имя файла
  try {
    // Получаем ссылку для скачивания файла с Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // Получаем ссылку для загрузки на Яндекс Диск
    const uploadUrl = await getYandexDiskUploadUrl(fileName);

    // Загружаем файл с Telegram и сразу отправляем его на Яндекс Диск
    const response = await axios({
      method: 'get',
      url: fileLink,
      responseType: 'stream', // Получаем поток данных
    });

    // Загружаем поток в Яндекс Диск
    const uploadResponse = await axios.put(uploadUrl, response.data, {
      headers: {
        'Content-Type': 'application/octet-stream', // Тип содержимого
      },
    });

    if (uploadResponse.status === 201) {
      console.log(`Файл ${fileName} успешно загружен на Яндекс Диск!`);
      ctx.reply(`Файл ${fileName} был успешно загружен на Яндекс Диск.`);
    } else {
      console.error('Ошибка загрузки на Яндекс Диск:', uploadResponse.status);
      ctx.reply('Произошла ошибка при загрузке на Яндекс Диск.');
    }
  } catch (error) {
    console.error('Ошибка при скачивании или загрузке файла:', error);
    ctx.reply('Произошла ошибка при обработке файла.');
  }

  await axios
    .put(
      `https://cloud-api.yandex.net/v1/disk/resources/publish?path=${fileName}`,
      null, // Здесь не требуется тело запроса
      {
        headers: {
          Authorization: `OAuth ${process.env.MY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    .then((response) => {
      console.log(response.data.href, 'asdasd');
      // Печатаем public_url (ссылку на файл) и public_key (ключ)
      console.log('Ссылка на файл:', response);
      console.log('Public Key:', response);
    })
    .catch((error) => {
      console.error(
        'Ошибка publich:',
        error.response ? error.response.data : error.message,
      );
    });

  //   const metadataResponse = await axios.get(
  //     `https://cloud-api.yandex.net/v1/disk/resources?path=${fileName}`,
  //     {
  //       headers: {
  //         Authorization: `OAuth ${process.env.MY_TOKEN}`,
  //       },
  //     },
  //   );
  //   console.log(metadataResponse, 'asdasd');
};

// Функция для получения ссылки для загрузки файла на Яндекс Диск
async function getYandexDiskUploadUrl(fileName) {
  const uploadUrl = 'https://cloud-api.yandex.net/v1/disk/resources/upload';
  const path = `/${fileName}`; // Путь на Яндекс Диске, куда будет загружен файл

  const headers = {
    Authorization: ` ${process.env.MY_TOKEN}`, // Авторизация с OAuth токеном
  };

  try {
    // Получаем URL для загрузки файла
    const res = await axios.get(uploadUrl, {
      headers,
      params: { path },
    });

    return res.data.href; // URL для загрузки файла на Яндекс Диск
  } catch (error) {
    console.error(
      'Ошибка получения ссылки для загрузки на Яндекс Диск:',
      error,
    );
    throw new Error('Не удалось получить ссылку для загрузки на Яндекс Диск');
  }
}

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

// Создание Wizard Scene
const registrationWizard = new Scenes.WizardScene(
  'registration-wizard',
  step1,
  step2,
  step3,
  step4,
  stepСheck,
  stepConfirmation,
);

// Создаем менеджер сцен и добавляем сцену
const stage = new Scenes.Stage([registrationWizard]);

// Включаем поддержку сессий и сцен
bot.use(session());
bot.use(stage.middleware());

// Обрабатываем команду /create для запуска сцены
bot.command('create', (ctx) => ctx.scene.enter('registration-wizard'));

// Запуск бота
bot
  .launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((err) => console.error('Ошибка при запуске бота:', err));

// Обработка ошибок
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
// const oauthToken = process.env.MY_TOKEN; // Замените на ваш OAuth-токен

// // URL API для получения списка файлов
// const url = 'https://cloud-api.yandex.net/v1/disk';

// fetch(url, {
//   method: 'GET',
//   headers: {
//     Authorization: `${oauthToken}`,
//     'content-type': 'application/json; charset=utf-8',
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data)) // Преобразуем ответ в формат JSON

//   .catch((error) => {
//     console.error('Error:', error); // Обработка ошибок
//   });
