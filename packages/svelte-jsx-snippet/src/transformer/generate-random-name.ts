export function generateRandomName(
  code: string,
  length = 4,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
): string {
  const ret = Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)],
  ).join("");
  if (code.includes(ret)) {
    return generateRandomName(code, length + 1, charset);
  }
  return ret;
}
