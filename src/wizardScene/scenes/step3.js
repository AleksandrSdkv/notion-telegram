export const step3 = async (ctx) => {
  if (ctx.message.text === 'Выйти') {
    await ctx.reply('Вы вышли из сцены. Введите /create, чтобы начать снова.');
    return ctx.scene.leave();
  }
  if (!ctx.message.text) {
    await ctx.reply(
      `Произошла ошибка загрузки файла попробуйте начать снова /create`,
    );
    return ctx.scene.leave();
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
