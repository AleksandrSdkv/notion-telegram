export const foundPerson = (ctx, personal) => {
  if (!ctx) {
    return 'Неправильный формат';
  }
  const found = personal.find(
    (person) => person.name.toLowerCase() === ctx.toLowerCase(),
  );
  return found;
};
