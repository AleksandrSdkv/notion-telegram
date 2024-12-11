import { key } from '../../constants/buttonConstants.js';
import { Markup } from 'telegraf';
export const step5 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /edit, чтобы начать снова.');
    return ctx.scene.leave();
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
    await ctx.reply(`Отлично! Давай проверим:
		- Имя: ${ctx.wizard.state.personal}
		- Наименование: ${ctx.wizard.state.product}
		- Срочность: ${ctx.wizard.state.quickly}
		- Счет: ${ctx.wizard.state.expense}
		Всё верно? (да/нет)`);
    return ctx.wizard.next();
  }
  await ctx.reply(`Отлично! Давай проверим:
	- Имя: ${ctx.wizard.state.personal}
	- Наименование: ${ctx.wizard.state.product}
	- Срочность: 'Не срочно'
	- Счет: ${ctx.wizard.state.expense}
	Всё верно? (да/нет)`);
  return ctx.wizard.next();
};
