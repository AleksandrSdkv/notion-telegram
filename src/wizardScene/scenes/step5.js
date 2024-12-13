import axios from 'axios';
import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
import {
  getYandexDiskUploadUrl,
  publishFileToYandexDisk,
  getYandexDiskFileMetadata,
} from '../../yandexAPI/yandexDiskServices.js';
import { stageOut } from '../../constants/helpers.js';

export const step5 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    return await stageOut(ctx);
  }
  if (!ctx.message.document && !ctx.message.photo) {
    await ctx.reply(
      `Произошла ошибка загрузки файла попробуйте начать снова /create`,
    );
    return ctx.scene.leave();
  }
  const pathName = process.env.PATH_DISK;
  if (ctx.message.document) {
    try {
      const { file_id: fileId, file_name: fileName } = ctx.message.document;

      const [fileLink, uploadUrl] = await Promise.all([
        ctx.telegram.getFileLink(fileId),
        getYandexDiskUploadUrl(fileName, pathName, process.env.MY_TOKEN),
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

      publishFileToYandexDisk(fileName, pathName, process.env.MY_TOKEN).then(
        (_) => {
          getYandexDiskFileMetadata(
            fileName,
            pathName,
            process.env.MY_TOKEN,
          ).then((res) => {
            ctx.wizard.state.expense = res.data.public_url;

            ctx.wizard.state.list['Счет'] = {
              files: [
                {
                  name: ctx.wizard.state.product,
                  external: {
                    url: res.data.public_url,
                  },
                },
              ],
            };
            ctx.reply(
              `Ваш файл доступен по ссылке: ${res.data.public_url}, выберите срочность заявки:`,
              Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
                .resize()
                .oneTime(),
            );
            return ctx.wizard.next();
          });
        },
      );
    } catch (error) {
      await ctx.reply(
        `Произошла ошибка загрузки файла попробуйте начать снова /create`,
      );
      console.error(error);
      return ctx.scene.leave();
    }
  }
  if (ctx.message.photo) {
    try {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const photoName = `${ctx.message.photo[ctx.message.photo.length - 1].file_unique_id}.jpg`;
      const [fileLink, uploadUrl] = await Promise.all([
        ctx.telegram.getFileLink(fileId),
        getYandexDiskUploadUrl(photoName, pathName, process.env.MY_TOKEN),
      ]);
      const response = await axios.get(fileLink, { responseType: 'stream' });
      const uploadResponse = await axios
        .put(uploadUrl, response.data, {
          headers: { 'Content-Type': 'application/octet-stream' },
        })
        .catch((error) => {
          console.error(error);
        });
      if (uploadResponse.status !== 201) {
        await ctx.reply(
          `Произошла ошибка загрузки файла на стороне yandexDisk. Попробуйте начать снова /create`,
        );
        return ctx.scene.leave();
      }

      publishFileToYandexDisk(photoName, pathName, process.env.MY_TOKEN).then(
        (_) => {
          getYandexDiskFileMetadata(
            photoName,
            pathName,
            process.env.MY_TOKEN,
          ).then((res) => {
            ctx.wizard.state.expense = res.data.public_url;
            ctx.wizard.state.list['Счет'] = {
              files: [
                {
                  name: ctx.wizard.state.product,
                  external: {
                    url: res.data.public_url,
                  },
                },
              ],
            };
            ctx.reply(
              `Ваш файл доступен по ссылке: ${res.data.public_url}, выберите срочность заявки:`,
              Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
                .resize()
                .oneTime(),
            );
            return ctx.wizard.next();
          });
        },
      );
    } catch (error) {
      await ctx.reply(
        `Произошла ошибка загрузки файла на стороне Notion. Попробуйте начать снова /create`,
      );
      console.error(error);
      return ctx.scene.leave();
    }
  }
};
