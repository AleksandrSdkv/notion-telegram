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

Object.entries(database.properties).forEach(([propertyName, propertyValue]) => {
  console.log(`${propertyName}: ${propertyValue.type}`);
});
