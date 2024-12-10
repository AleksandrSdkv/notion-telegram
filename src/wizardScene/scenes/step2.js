import axios from 'axios';
import {
  getYandexDiskUploadUrl,
  publishFileToYandexDisk,
  getYandexDiskFileMetadata,
} from '../../yandexAPI/yandexDiskServices.js';

export const step2 = async (ctx) => {
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

    if (uploadResponse.status !== 201)
      throw new Error('Ошибка загрузки на Яндекс Диск');

    await ctx.reply(`Файл ${fileName} был успешно загружен.`);
    publishFileToYandexDisk(fileName, pathName, process.env.MY_TOKEN).then(
      (_) => {
        getYandexDiskFileMetadata(
          fileName,
          pathName,
          process.env.MY_TOKEN,
        ).then((res) => {
          ctx.reply(`Ваш файл доступен по ссылке: ${res.data.public_url}`);
        });
      },
    );
  } catch (error) {
    await ctx.reply('Ошибка при обработке файла.');
    console.error(error);
  }
  return ctx.wizard.next();
};
