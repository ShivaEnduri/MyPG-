export const toMySQLDateTime = (date: Date | string) => {
  const d = new Date(date);

  return d.toISOString().slice(0, 19).replace("T", " ");
};
