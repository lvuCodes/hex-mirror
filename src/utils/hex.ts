export const decToHex = (num: number): string =>
  num.toString(16).padStart(2, "0").toUpperCase();

export const hexToDec = (hex: string): number => parseInt(hex, 16);

export const hexStringToRGB = (
  hex: string
): { red: number; green: number; blue: number } => ({
  red: hexToDec(hex.slice(0, 2)),
  green: hexToDec(hex.slice(2, 4)),
  blue: hexToDec(hex.slice(4, 6)),
});

export const isHexCode = (input: string): boolean => {
  const hexRegex: RegExp = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};
