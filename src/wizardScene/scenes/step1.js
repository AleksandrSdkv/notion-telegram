import axios from 'axios';
import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
import { personal } from '../../constants/data.js';
import { foundPersonById } from '../../constants/helpers.js';
import pkg from 'short-uuid';

import {
  getYandexDiskUploadUrl,
  publishFileToYandexDisk,
  getYandexDiskFileMetadata,
} from '../../yandexAPI/yandexDiskServices.js';
import dotenv from 'dotenv';
dotenv.config();
export const step1 = async (ctx) => {
  ctx.wizard.state.list = {};
  console.log(ctx.update.message.from);
  const pathName = process.env.PATH_DISK ? process.env.PATH_DISK : '';

  let yandexDiskConfig = {
    fileId: '',
    fileName: '',
  };

  if (ctx.message.document) {
    const { file_id, file_name } = ctx.message.document;
    yandexDiskConfig.fileId = file_id;
    yandexDiskConfig.fileName = file_name;
  }
  if (ctx.message.photo) {
    yandexDiskConfig.fileId =
      ctx.message.photo[ctx.message.photo.length - 1].file_id;
    yandexDiskConfig.fileName = `${ctx.message.photo[ctx.message.photo.length - 1].file_unique_id}.jpg`;
  }
  try {
    const [fileLink, uploadUrl] = await Promise.all([
      ctx.telegram.getFileLink(yandexDiskConfig.fileId),
      getYandexDiskUploadUrl(
        yandexDiskConfig.fileName,
        pathName,
        process.env.MY_TOKEN,
      ),
    ]).catch((error) => {
      `Произошла ошибка загрузки файла на стороне yandexDisk. Попробуйте начать снова /create`,
        console.error(error);
    });
    const response = await axios.get(fileLink, { responseType: 'stream' });
    const uploadResponse = await axios.put(uploadUrl, response.data, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });

    if (uploadResponse.status !== 201) {
      await ctx.reply(
        `Произошла ошибка загрузки файла на стороне yandexDisk. Попробуйте начать снова /create`,
      );
      return ctx.scene.leave();
    }
    try {
      publishFileToYandexDisk(
        yandexDiskConfig.fileName,
        pathName,
        process.env.MY_TOKEN,
      ).then((_) => {
        getYandexDiskFileMetadata(
          yandexDiskConfig.fileName,
          pathName,
          process.env.MY_TOKEN,
        ).then((res) => {
          ctx.wizard.state.expense = res.data.public_url;
          ctx.wizard.state.list['Счет'] = {
            files: [
              {
                name: yandexDiskConfig.fileName,
                external: {
                  url: res.data.public_url,
                },
              },
            ],
          };
          if (!res.data.public_url) {
            ctx.reply(
              ` Произошла ошибка загрузки файла попробуйте начать снова`,
            );
            return;
          }

          const person = foundPersonById(ctx.update.message.from.id, personal);
          ctx.wizard.state.personal = person.name;
          ctx.wizard.state.list['Заявитель'] = {
            people: [
              {
                id: person.id,
              },
            ],
          };

          ctx.wizard.state.list['Исполнитель'] = {
            // id Даши
            people: [
              {
                id: '18870c7a-d18a-4dc5-8b90-7cc2598fccd4',
              },
            ],
          };
          const shortId = pkg.generate();
          ctx.wizard.state.list['Уникальный номер'] = {
            rich_text: [
              {
                text: {
                  content: shortId,
                },
              },
            ],
          };
          ctx.reply(
            `Отлично ${person.name}. Ваш файл доступен по ссылке: ${res.data.public_url}. Выберите утверждающего:`,
            Markup.keyboard([
              ['Сергей Матюшенко', 'Булат Ханнанов'],
              ['Полина Михайлова', 'Арина Матюшенко'],

              [`${key.out}`],
            ])
              .resize()
              .oneTime(),
          );

          return ctx.wizard.next();
        });
      });
    } catch (error) {
      await ctx.reply(
        `Произошла ошибка загрузки файла: подождите немного и попробуйте начать снова`,
      );
    }
  } catch (error) {
    await ctx.reply(
      `Произошла ошибка загрузки файла: подождите немного и попробуйте начать снова`,
    );
    console.error(error);
    return ctx.scene.leave();
  }
};
