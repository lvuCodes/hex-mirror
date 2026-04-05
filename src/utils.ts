export const isHexCode = (input: string) => {
  const hexRegex: RegExp = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};

const decToHex = (num: number): String => {
  return num.toString(16).padStart(2, "0").toUpperCase();
};

export const getRandom256 = (): number => {
  return Math.floor(Math.random() * 255);
};

export const randomDecToHex = (): String => {
  return decToHex(getRandom256());
};

// #RRGGBB
export const getRandomHex = () => {
  const R = randomDecToHex();
  const G = randomDecToHex();
  const B = randomDecToHex();

  return `${R}${G}${B}`;
};
