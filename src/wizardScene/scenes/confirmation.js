import { createNewGroup } from '../../notion.js';
export const stepConfirmation = async (ctx) => {
  const confirmation = ctx.message.text.toLowerCase();
  if (confirmation === 'да') {
    await ctx.reply('Запрос завершен! 🎉');
    createNewGroup(ctx.wizard.state.list);
    return ctx.scene.leave(); // Завершение сцены
  } else if (confirmation === 'нет') {
    await ctx.reply('Давай начнем сначала. Введи /start.');
    return ctx.scene.leave(); // Завершение сцены
  } else {
    await ctx.reply('Пожалуйста, ответь "да" или "нет".');
  }
  return ctx.scene.leave();
};
