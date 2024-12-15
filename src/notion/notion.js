import { Client, LogLevel } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();
const notion = new Client({
  auth: process.env.NOTION_KEY,
  logLevel: LogLevel.DEBUG,
});
const blockId = process.env.NOTION_ID_DB;

export const createNewGroup = async (propertiesData) => {
  try {
    const parameters = {
      parent: { database_id: blockId },
      properties: propertiesData,
    };
    await notion.pages.create(parameters);
  } catch (error) {
    console.error('Произошла ошибка при отправке данных в Notion:', error);
  }
};
