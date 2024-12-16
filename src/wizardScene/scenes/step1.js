import axios from 'axios';
import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
import {
  getYandexDiskUploadUrl,
  publishFileToYandexDisk,
  getYandexDiskFileMetadata,
} from '../../yandexAPI/yandexDiskServices.js';
import dotenv from 'dotenv';
dotenv.config();
export const step1 = async (ctx) => {
  ctx.wizard.state.list = {};
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
          ctx.reply(` Произошла ошибка загрузки файла попробуйте начать снова`);
          return;
        }

        ctx.reply(
          `Ваш файл доступен по ссылке: ${res.data.public_url}. Выберите заявителя:`,
          Markup.keyboard([
            ['Лилия Иванова', 'Regina Yunusova', 'Гузель Шангараева'],
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
      `Произошла ошибка загрузки файла: ${error} попробуйте начать снова`,
    );
    console.error(error);
    return ctx.scene.leave();
  }
};
