// (async () => {
//   try {
//     const response = await notion.databases.query({
//       database_id: blockId,
//     });
//     const users = response.results.map((row) => {
//       return {
//         name: row.properties['Заявитель'].people[0],
//       };
//     });

//     console.log('Список людей из базы:', users);
//   } catch (error) {
//     console.error('Ошибка при получении людей из базы:', error);
//   }
// })();
