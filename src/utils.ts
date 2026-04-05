export const isHexCode = (input: string) => {
  const hexRegex: RegExp = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};
