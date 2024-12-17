import { key } from '../../constants/buttonConstants.js';
import { Markup } from 'telegraf';
import { stageOut } from '../../constants/helpers.js';
export const step4 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    return await stageOut(ctx);
  }

  if (ctx.message.text === 'Срочно') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'Срочно',
      },
    };
  }
  if (ctx.message.text === 'До 7 дней') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'До 7 дней',
      },
    };
  }
  if (ctx.message.text === 'До 3х дней') {
    ctx.wizard.state.list['Срочность'] = {
      type: 'status',
      status: {
        name: 'До 3х дней',
      },
    };
  }
  await ctx.reply(
    `Вы выбрали: ${ctx.message.text}. пожалуйста Выберите отель`,
    Markup.keyboard([
      ['Somov Hotel', 'Cho Hotel'],
      ['Karl House', 'Ma Apart'],
      ['Spot 80', '1010 Апартаменты'],

      [`${key.out}`],
    ])
      .resize()
      .oneTime(),
  );
  console.log(ctx.wizard.state.list);
  ctx.wizard.state.quickly = ctx.message.text;
  return ctx.wizard.next();
};
