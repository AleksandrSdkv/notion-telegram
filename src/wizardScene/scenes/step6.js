import { hotels } from '../../data.js';
import { createNewGroup } from '../../notion.js';
import { foundHotel } from '../../constants/helpers.js';
import { Markup } from 'telegraf';
export const step6 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /create, чтобы начать снова.');
    return ctx.scene.leave();
  }

  const hotel = foundHotel(ctx.message.text, hotels);
  if (!hotel) {
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. К сожалению сотрудника с таким именем нет! Введите /create, чтобы начать снова.`,
    );
    ctx.scene.leave();
    return;
  }
  if (hotel) {
    ctx.wizard.state.hotel = ctx.message.text;

    ctx.wizard.state.list['🏡 Объекты'] = {
      type: 'relation',
      relation: [
        {
          id: hotel.id,
        },
      ],
    };
  }
  createNewGroup(ctx.wizard.state.list)
    .then(async () => {
      await ctx.reply(
        `Запрос завершен! 🎉
		- Имя: ${ctx.wizard.state.personal}
		- Наименование: ${ctx.wizard.state.product}
		- Срочность: ${ctx.wizard.state.quickly}
		- Счет: ${ctx.wizard.state.expense}
		- Объект: ${ctx.wizard.state.hotel}
		Заявка доступна по ссылке: https://www.notion.so/500na700/dfe5616ac1694459b0d18d87713f0ffa?v=5cbfb807d92f4f889d4dcb3f1e8fbfe8`,
        Markup.keyboard([['/create', '/help']])
          .resize()
          .oneTime(),
      );

      return ctx.scene.leave();
    })
    .catch(async (err) => {
      console.log(err);
      await ctx.reply(`Запрос не завершен! Произшла ошибка. Повторите запрос /create.
		Так же нужно удалить счет: ${ctx.wizard.state.expense}`);
      return ctx.scene.leave();
    });
};
