import { personal } from '../../data.js';
import { foundPerson } from '../../constants/helpers.js';
import { key } from '../../constants/buttonConstants.js';
import { Markup } from 'telegraf';
export const step2 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /create, чтобы начать снова.');
    return ctx.scene.leave();
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
    await ctx.reply(
      `Отлично, ${ctx.message.text}!  Пожалуйста, введите поле "Наименование" (пример: "Стул"):`,
      Markup.keyboard([[`${key.out}`]])
        .resize()
        .oneTime(),
    );
    ctx.wizard.state.list['Заявитель'] = {
      // Сохраняем имя пользователя
      people: [
        {
          id: person.id,
        },
      ],
    };
  }
  return ctx.wizard.next();
};
