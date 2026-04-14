export interface RGBValues {
  red: number;
  green: number;
  blue: number;
  R: string;
  G: string;
  B: string;
}

export interface HSLValues {
  hue: number;
  sat: number;
  lum: number;
}

export interface MirrorSet {
  mirror_HSL: string;
  mirror_HSl: string;
  mirror_HsL: string;
  mirror_Hsl: string;
  mirror_hSL: string;
  mirror_hSl: string;
  mirror_hsL: string;
  mirror_hsl: string;
}

export interface ColorCard {
  hex: string;
  RGB: RGBValues;
  RGBComp: RGBValues;
  HSL: HSLValues;
  HSLComp: HSLValues;
  mirrorSet: MirrorSet;
}

export interface HexEntry {
  hex: string;
  RGB?: RGBValues;
  HSL?: HSLValues;
}

export interface CompareItem {
  hexA: HexEntry;
  hexB: HexEntry;
}


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
  return { dec: 255 - num, hex: decToHex(255 - num) };
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

const hslToHex = ({
  hue,
  sat,
  lum,
}: {
  hue: number;
  sat: number;
  lum: number;
}): string => {
  const chroma = (1 - Math.abs(2 * lum - 1)) * sat;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const offset = lum - chroma / 2;

  let red = 0,
    green = 0,
    blue = 0;
  if (hue < 60) {
    red = chroma;
    green = secondary;
    blue = 0;
  } else if (hue < 120) {
    red = secondary;
    green = chroma;
    blue = 0;
  } else if (hue < 180) {
    red = 0;
    green = chroma;
    blue = secondary;
  } else if (hue < 240) {
    red = 0;
    green = secondary;
    blue = chroma;
  } else if (hue < 300) {
    red = secondary;
    green = 0;
    blue = chroma;
  } else {
    red = chroma;
    green = 0;
    blue = secondary;
  }

  const R = decToHex(Math.round((red + offset) * 255));
  const G = decToHex(Math.round((green + offset) * 255));
  const B = decToHex(Math.round((blue + offset) * 255));

  return `${R}${G}${B}`;
};

const getMirrorSet = ({
  hue,
  sat,
  lum,
}: {
  hue: number;
  sat: number;
  lum: number;
}) => {
  const hueComp = 360 - hue;
  const satComp = 1 - sat;
  const lumComp = 1 - lum;

  return {
    mirror_HSL: hslToHex({ hue: hueComp, sat: satComp, lum: lumComp }),
    mirror_HSl: hslToHex({ hue: hueComp, sat: satComp, lum }),
    mirror_HsL: hslToHex({ hue: hueComp, sat, lum: lumComp }),
    mirror_Hsl: hslToHex({ hue: hueComp, sat, lum }),
    mirror_hSL: hslToHex({ hue, sat: satComp, lum: lumComp }),
    mirror_hSl: hslToHex({ hue, sat: satComp, lum }),
    mirror_hsL: hslToHex({ hue, sat, lum: lumComp }),
    mirror_hsl: hslToHex({ hue, sat, lum }), // this is actually the same as the og hex
  };
};

export const getRandomHex = () => {
  const { dec: red, hex: R } = randomDecToHex();
  const { dec: green, hex: G } = randomDecToHex();
  const { dec: blue, hex: B } = randomDecToHex();

  return {
    hex: `${R}${G}${B}`,
    RGB: { red, green, blue, R, G, B },
  };
};

export const calculateHexAttr = ({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}): ColorCard => {
  const R = decToHex(red);
  const G = decToHex(green);
  const B = decToHex(blue);

  const { dec: redComp, hex: RComp } = getComplementValues(red);
  const { dec: greenComp, hex: GComp } = getComplementValues(green);
  const { dec: blueComp, hex: BComp } = getComplementValues(blue);

  const { hue, sat, lum } = getHSL({ red, green, blue });
  const mirrorSet = getMirrorSet({ hue, sat, lum });

  return {
    hex: `${R}${G}${B}`,
    RGB: { red, green, blue, R, G, B },
    RGBComp: {
      red: redComp,
      green: greenComp,
      blue: blueComp,
      R: RComp,
      G: GComp,
      B: BComp,
    },
    HSL: { hue, sat, lum },
    HSLComp: { hue: 360 - hue, sat: 1 - sat, lum: 1 - lum },
    mirrorSet,
  };
};

const hexStringToRGB = (hex: string): { red: number; green: number; blue: number } => ({
  red: hexToDec(hex.slice(0, 2)),
  green: hexToDec(hex.slice(2, 4)),
  blue: hexToDec(hex.slice(4, 6)),
});

export const populateState = (initial: CompareItem[]): CompareItem[] =>
  initial.map(({ hexA, hexB }) => {
    const rgbA = hexStringToRGB(hexA.hex);
    const rgbB = hexStringToRGB(hexB.hex);
    return {
      hexA: {
        hex: hexA.hex,
        RGB: { ...rgbA, R: decToHex(rgbA.red), G: decToHex(rgbA.green), B: decToHex(rgbA.blue) },
        HSL: getHSL(rgbA),
      },
      hexB: {
        hex: hexB.hex,
        RGB: { ...rgbB, R: decToHex(rgbB.red), G: decToHex(rgbB.green), B: decToHex(rgbB.blue) },
        HSL: getHSL(rgbB),
      },
    };
  });
