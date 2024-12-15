import { key } from '../../constants/buttonConstants.js';
import { Markup } from 'telegraf';
import { stageOut } from '../../constants/helpers.js';
export const step5 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    return await stageOut(ctx);
  }
  if (ctx.message.text !== 'Не срочно' && ctx.message.text !== 'Срочно') {
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите правильный вариант или нажмите Выйти`,
      Markup.keyboard([['Срочно', 'Не срочно'], [`${key.out}`]])
        .resize()
        .oneTime(),
    );
  }

  if (ctx.message.text === 'Срочно') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'Срочно',
      },
    };
    ctx.wizard.state.quickly = ctx.message.text;
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите отель`,
      Markup.keyboard([
        ['Somov Hotel', 'Cho Hotel'],
        ['Karl House', 'Ma Apart'],
        ['Spot 80', '1010 Апартаменты'],
        ['test'],
        [`${key.out}`],
      ])
        .resize()
        .oneTime(),
    );

    return ctx.wizard.next();
  }
  ctx.wizard.state.quickly = 'Не срочно';
  await ctx.reply(
    `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите отель`,
    Markup.keyboard([
      ['Somov Hotel', 'Cho Hotel'],
      ['Karl House', 'Ma Apart'],
      ['Spot 80', '1010 Апартаменты'],
      ['test'],
      [`${key.out}`],
    ])
      .resize()
      .oneTime(),
  );

  return ctx.wizard.next();
};
