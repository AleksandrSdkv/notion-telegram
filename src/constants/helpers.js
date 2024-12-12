export const foundPerson = (ctx, personal) => {
  if (!ctx) {
    return 'Неправильный формат';
  }
  const found = personal.find(
    (person) => person.name.toLowerCase() === ctx.toLowerCase(),
  );
  return found;
};
export const foundHotel = (ctx, hotels) => {
  if (!ctx) {
    return 'Неправильный формат';
  }
  const found = hotels.find(
    (hotel) => hotel.name.toLowerCase() === ctx.toLowerCase(),
  );
  return found;
};
export const stageOut = (ctx) => {
  ctx.reply('Вы вышли из сцены. Введите /create, чтобы начать снова.');
  return ctx.scene.leave();
};
