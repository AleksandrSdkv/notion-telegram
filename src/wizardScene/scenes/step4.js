import { stageOut } from '../../constants/helpers.js';
export const step4 = async (ctx) => {
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
  await ctx.reply(
    `Вы выбрали: ${ctx.message.text}. Далее нужно загрузить счет в формате PDF`,
  );

  return ctx.wizard.next();
};
