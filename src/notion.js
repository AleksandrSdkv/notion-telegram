import { Client, LogLevel } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const notion = new Client({
  auth: process.env.NOTION_KEY,
  logLevel: LogLevel.DEBUG,
});
const blockId = process.env.NOTION_ID_DB;
// (async () => {
//   try {
//     const response = await notion.databases.query({
//       database_id: blockId,
//     });
//     const users = response.results.map((row) => {
//       return {
//         name: row.properties['🏡 Объекты'].relation,
//       };
//     });

//     users.forEach((user) => console.log(user));
//   } catch (error) {
//     console.error('Ошибка при получении людей из базы:', error);
//   }
// })();

export const createNewGroup = async (propertiesData) => {
  try {
    const parameters = {
      parent: { database_id: blockId },
      properties: propertiesData,
    };
    console.log(parameters, 'запрос');
    await notion.pages.create(parameters);
    // const response = await notion.pages.create({
    // parent: { database_id: blockId },
    //   Дата добавляется в Notion автоматически
    // properties: {
    //   Наименование: {
    //     title: [
    //       {
    //         text: {
    //           content: 'Стул',
    //         },
    //       },
    //     ],
    //   },
    // Отдел: {
    //   relation: [
    //     {
    //       id: '80698abe-57f2-454d-9a6c-27e8065848af',
    //     },
    //   ],
    // },
    // 'Статья бюджета': {
    //   rich_text: [
    //     {
    //       text: {
    //         content: 'A dark green leafy vegetable',
    //       },
    //     },
    //   ],
    // },
    // Счета: {
    //   url: 'https://disk.yandex.ru/i/Rk9i19RsrVTrRw',
    // },
    // Status: {
    //   type: 'status',
    //   status: {
    //     name: 'Согласовать', //Оплачен
    //   },
    // },
    // Срочность: {
    //   type: 'status',
    //   status: {
    //     name: 'Не срочно', //Срочно
    //   },
    // },
    // Заявитель: {
    //   people: [
    //     {
    //       id: 'eb7fad6f-e1b1-4109-ab9f-9db7924041b6',
    //       //   id: ' ',
    //     },
    //   ],
    // },
    // Утверждающий: {
    //   people: [
    //     {
    //       id: 'eb7fad6f-e1b1-4109-ab9f-9db7924041b6',
    //       //   id: ' ',
    //     },
    //   ],
    // },
    // },
    // });
  } catch (error) {
    console.error('Error fetching database:', error);
  }
};
