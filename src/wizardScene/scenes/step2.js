import { personal } from '../../constants/data.js';
import { foundPerson } from '../../constants/helpers.js';
import { key } from '../../constants/buttonConstants.js';
import { Markup } from 'telegraf';
import { stageOut } from '../../constants/helpers.js';
export const step2 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    return await stageOut(ctx);
  }

  const person = foundPerson(ctx.message.text, personal);
  if (!person) {
    await ctx.reply(
      `Вы выбрали: ${ctx.message.text}. К сожалению сотрудника с таким именем нет! Введите /create, чтобы начать снова.`,
    );
    ctx.scene.leave();
    return;
  }
  if (person) {
    ctx.wizard.state.personal = ctx.message.text;
    ctx.reply(
      'Выберите утверждающего:',
      Markup.keyboard([
        ['Сергей Матюшенко', 'Булат Ханнанов'],
        ['Полина Михайлова', 'Арина Матюшенко'],

        [`${key.out}`],
      ])
        .resize()
        .oneTime(),
    );
    ctx.wizard.state.list['Заявитель'] = {
      people: [
        {
          id: person.id,
        },
      ],
    };
  }

  return ctx.wizard.next();
};
