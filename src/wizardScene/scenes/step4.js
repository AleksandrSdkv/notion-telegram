import axios from 'axios';
import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
import {
  getYandexDiskUploadUrl,
  publishFileToYandexDisk,
  getYandexDiskFileMetadata,
} from '../../yandexAPI/yandexDiskServices.js';

export const step4 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /create, чтобы начать снова.');
    return ctx.scene.leave();
  }
  if (!ctx.message.document && !ctx.message.photo) {
    await ctx.reply(
      `Произошла ошибка загрузки файла попробуйте начать снова /create`,
    );
    return ctx.scene.leave();
  }
  if (ctx.message.document) {
    console.log(ctx.message.document);
    try {
      const { file_id: fileId, file_name: fileName } = ctx.message.document;
      const pathName = '/testBot/';
      const [fileLink, uploadUrl] = await Promise.all([
        ctx.telegram.getFileLink(fileId),
        getYandexDiskUploadUrl(fileName, pathName, process.env.MY_TOKEN),
      ]);

      const response = await axios.get(fileLink, { responseType: 'stream' });
      const uploadResponse = await axios.put(uploadUrl, response.data, {
        headers: { 'Content-Type': 'application/octet-stream' },
      });

      if (uploadResponse.status !== 201) {
        await ctx.reply(
          `Произошла ошибка загрузки файла попробуйте начать снова /create`,
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
            console.log(ctx.wizard.state.list['Счет']);
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
        'Ошибка при обработке файла возможно файл с таким именем уже есть. Попробуйте еще раз /create',
      );
      console.error(error);
      return ctx.scene.leave();
    }
  }
  if (ctx.message.photo) {
    console.log(ctx.message);
    //     try {
    //       const { file_id: fileId, file_name: fileName } = ctx.message.document;
    //       const pathName = '/testBot/';
    //       const [fileLink, uploadUrl] = await Promise.all([
    //         ctx.telegram.getFileLink(fileId),
    //         getYandexDiskUploadUrl(fileName, pathName, process.env.MY_TOKEN),
    //       ]);
    //       const response = await axios.get(fileLink, { responseType: 'stream' });
    //       const uploadResponse = await axios.put(uploadUrl, response.data, {
    //         headers: { 'Content-Type': 'application/octet-stream' },
    //       });
    //       if (uploadResponse.status !== 201) {
    //         await ctx.reply(
    //           `Произошла ошибка загрузки файла попробуйте начать снова /create`,
    //         );
    //         return ctx.scene.leave();
    //       }
    //       publishFileToYandexDisk(fileName, pathName, process.env.MY_TOKEN).then(
    //         (_) => {
    //           getYandexDiskFileMetadata(
    //             fileName,
    //             pathName,
    //             process.env.MY_TOKEN,
    //           ).then((res) => {
    //             ctx.wizard.state.expense = res.data.public_url;
    //             ctx.wizard.state.list['Счет'] = {
    //               files: [
    //                 {
    //                   name: ctx.wizard.state.product,
    //                   external: {
    //                     url: res.data.public_url,
    //                   },
    //                 },
    //               ],
    //             };
    //             console.log(ctx.wizard.state.list['Счет']);
    //             ctx.reply(
    //               `Ваш файл доступен по ссылке: ${res.data.public_url}, выберите срочность заявки:`,
    //               Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
    //                 .resize()
    //                 .oneTime(),
    //             );
    //             return ctx.wizard.next();
    //           });
    //         },
    //       );
    //     } catch (error) {
    //       await ctx.reply(
    //         'Ошибка при обработке файла возможно файл с таким именем уже есть. Попробуйте еще раз /create',
    //       );
    //       console.error(error);
    //       return ctx.scene.leave();
    //     }
  }
};
