import { decToHex, hexStringToRGB } from "./hex";

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

export const getHSL = ({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}): HSLValues => {
  const rNorm = red / 255;
  const gNorm = green / 255;
  const bNorm = blue / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  const lum = (min + max) / 2;
  const sat = diff === 0 ? 0 : diff / (1 - Math.abs(2 * lum - 1));

  let hue = 0;
  if (diff !== 0) {
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
    }
  }
  if (hue < 0) hue += 360;

  return { hue, sat, lum };
};

export const hslToHex = ({
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
  } else if (hue < 120) {
    red = secondary;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = secondary;
  } else if (hue < 240) {
    green = secondary;
    blue = chroma;
  } else if (hue < 300) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  const R = decToHex(Math.round((red + offset) * 255));
  const G = decToHex(Math.round((green + offset) * 255));
  const B = decToHex(Math.round((blue + offset) * 255));

  return `${R}${G}${B}`;
};

// Average Absolute Diff - Google Sheets dark vs light
//              737373    757171    |diff|    % diff
// Red          115       117         2       0.0172
// Green        115       113         2       0.0175
// Blue         115       113         2       0.0175
// Hue          0         0.8802    0.8802    2
// Saturation   0         0.0200    0.0200    2
// Lightness    0.4509    0.4511    0.0001    0.0003
const RGB_CHANGE = 113 + Math.round(Math.random() * 4);

const clampChannel = (n: number): number => Math.max(0, Math.min(255, n));

export const getGSheetsComp = (hex: string): string => {
  const rgb = hexStringToRGB(hex);
  const { lum } = getHSL(rgb);
  const change = lum < 0.5 ? "light" : "dark";

  const delta = change === "light" ? RGB_CHANGE : -RGB_CHANGE;

  return `${decToHex(clampChannel(rgb.red + delta))}${decToHex(clampChannel(rgb.green + delta))}${decToHex(clampChannel(rgb.blue + delta))}`;
};

export const getMirrorSet = ({
  hue,
  sat,
  lum,
}: {
  hue: number;
  sat: number;
  lum: number;
}): MirrorSet => {
  const hex = hslToHex({ hue, sat, lum });
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
    mirror_hsl: getGSheetsComp(hex),
  };
};
