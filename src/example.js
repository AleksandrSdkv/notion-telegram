// Выводит заголовки блоков
// (async () => {
//     const response = await notion.databases.query({ database_id: blockId });
//     console.log(response.results.forEach((item) => console.log(item.properties.Name.title[0].text.content)));
// })();
(async () => {
  const response = await notion.databases.query({ database_id: blockId });
  for (let i = 0; i < response.results.length; i++) {
    console.log(response.results[i].properties['Отдел']);
  }
})();
//   (async () => {
//     const pageId = '569ce720bd504d31a05e9bc1ebd1a1f0';
//     const response = await notion.pages.retrieve({ page_id: pageId });
//     console.log(response);
//   })();

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
bot.action('Aleksandr', async (ctx) => {
  ctx.reply('действие');
});
Object.entries(database.properties).forEach(([propertyName, propertyValue]) => {
  console.log(`${propertyName}: ${propertyValue.type}`);
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


bot.on('document', async (ctx) => {
    const fileId = ctx.message.document.file_id; // Получаем file_id документа
    const fileName = ctx.message.document.file_name; // Имя файла

    try {
        // Получаем ссылку для скачивания файла
        const fileLink = await ctx.telegram.getFileLink(fileId);

        // Загружаем файл
        const response = await axios({
            method: 'get',
            url: fileLink,
            responseType: 'stream'
        });

        // Сохраняем файл на сервере
        const writer = fs.createWriteStream(`./${fileName}`);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log(`Файл ${fileName} успешно загружен!`);
            ctx.reply(`Файл ${fileName} был успешно загружен.`);
        });

        writer.on('error', (err) => {
            console.error('Ошибка записи файла:', err);
            ctx.reply('Произошла ошибка при сохранении файла.');
        });
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        ctx.reply('Произошла ошибка при получении файла.');
    }
});