import { Markup } from 'telegraf';
import { key } from '../../constants/buttonConstants.js';
export const step1 = async (ctx) => {
  ctx.wizard.state.list = {};
  ctx.reply(
    'Выберите заявителя:',
    Markup.keyboard([
      ['Лилия Иванова', 'Полина Михайлова', 'Гузель Шангараева'],
      [`${key.out}`],
    ])
      .resize()
      .oneTime(),
  );
  return ctx.wizard.next(); // Переход к следующему шагу
};
