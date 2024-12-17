import { stageOut } from '../../constants/helpers.js';
import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
export const step3 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    return await stageOut(ctx);
  }

  ctx.wizard.state.list['Наименование'] = {
    title: [
      {
        text: {
          content: ctx.message.text,
        },
      },
    ],
  };
  ctx.wizard.state.product = ctx.message.text;
  try {
    ctx.reply(
      `Вы выбрали: ${ctx.message.text}. Выберите срочность заявки:`,
      Markup.keyboard([['Срочно', 'До 3х дней', 'До 7 дней'], [`${key.out}`]])
        .resize()
        .oneTime(),
    );
  } catch (error) {
    await ctx.reply(
      `Произошла ошибка: ${error}. Попробуйте начать снова или загрузите файл позже`,
    );
    console.error(error);
    return ctx.scene.leave();
  }

  return ctx.wizard.next();
};
