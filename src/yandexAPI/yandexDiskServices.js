import axios from 'axios';
export async function getYandexDiskUploadUrl(
  fileName,
  pathName,
  yandexDiscToken,
) {
  try {
    const response = await axios.get(
      'https://cloud-api.yandex.net/v1/disk/resources/upload',
      {
        headers: { Authorization: `OAuth ${yandexDiscToken}` },
        params: { path: `${pathName}${fileName}` },
      },
    );
    return response.data.href; // URL для загрузки файла на Яндекс Диск
  } catch (error) {
    console.error(
      'Ошибка получения ссылки для загрузки на Яндекс Диск:',
      error.message || error,
    );
    throw new Error('Не удалось получить ссылку для загрузки на Яндекс Диск');
  }
}

export const publishFileToYandexDisk = async (
  fileName,
  pathName,
  yandexDiscToken,
) => {
  await axios.put(
    `https://cloud-api.yandex.net/v1/disk/resources/publish?path=${encodeURIComponent(pathName + fileName)}`,
    null,
    {
      headers: {
        Authorization: `OAuth ${yandexDiscToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
};
export const getYandexDiskFileMetadata = async (
  fileName,
  pathName,
  yandexDiscToken,
) => {
  return await axios.get(
    `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(pathName + fileName)}`,
    {
      headers: { Authorization: `OAuth ${yandexDiscToken}` },
    },
  );
};
