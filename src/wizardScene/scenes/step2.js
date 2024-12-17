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
    ctx.wizard.state.approving = ctx.message.text;
    await ctx.reply(
      `Отлично, пожалуйста, введите поле "Наименование" (пример: "Стул"):`,
      Markup.keyboard([[`${key.out}`]])
        .resize()
        .oneTime(),
    );
    ctx.wizard.state.list['Утверждающий'] = {
      people: [
        {
          id: person.id,
        },
      ],
    };
  }
  return ctx.wizard.next(); // Переход к следующему шагу
};
