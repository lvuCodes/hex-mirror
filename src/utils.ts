export const isHexCode = (input: string) => {
  const hexRegex: RegExp = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};

const decToHex = (num: number): string => {
  return num.toString(16).padStart(2, "0").toUpperCase();
};

const hexToDec = (hex: string): number => {
  return parseInt(hex, 16);
};

export const getRandom256 = (): number => {
  return Math.floor(Math.random() * 255);
};

export const randomDecToHex = (): { dec: number; hex: string } => {
  const dec = getRandom256();
  return { dec, hex: decToHex(dec) };
};

const getComplementValues = (num: number): { dec: number; hex: string } => {
  return { dec: 255 - num, hex: decToHex(num) };
};

const getHSL = ({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}): { hue: number; sat: number; lum: number } => {
  const rNorm = red / 255;
  const gNorm = green / 255;
  const bNorm = blue / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  const lum = (min + max) / 2;
  const sat = diff == 0 ? 0 : diff / (1 - Math.abs(2 * lum - 1));

  let hue = 0;
  if (diff != 0) {
    switch (max) {
      case rNorm:
        hue = 60 * (((gNorm - bNorm) / diff) % 6);
        break;
      case gNorm:
        hue = 60 * ((bNorm - rNorm) / diff + 2);
        break;
      case bNorm:
        hue = 60 * ((rNorm - gNorm) / diff + 4);
        break;
      default:
        break;
    }
  }
  if (hue < 0) hue += 360;

  return { hue, sat, lum };
};

// #RRGGBB
export const getRandomHex = () => {
  const { dec: red, hex: R } = randomDecToHex();
  const { dec: green, hex: G } = randomDecToHex();
  const { dec: blue, hex: B } = randomDecToHex();

  const { dec: redComp, hex: RComp } = getComplementValues(red);
  const { dec: greenComp, hex: GComp } = getComplementValues(green);
  const { dec: blueComp, hex: BComp } = getComplementValues(blue);

  const { hue, sat, lum } = getHSL({ red, green, blue });

  return {
    hex: `${R}${G}${B}`,
    red,
    redComp,
    R,
    RComp,
    green,
    greenComp,
    G,
    GComp,
    blue,
    blueComp,
    B,
    BComp,
    hue,
    hueComp: 360 - hue,
    sat,
    satComp: 1 - sat,
    lum,
    lumComp: 1 - lum,
  };
};
