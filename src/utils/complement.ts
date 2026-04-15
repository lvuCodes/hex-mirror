import { absPercentDiff, percentDiff } from "./calc";
import { decToHex, hexStringToRGB } from "./hexadecimal";
import { getHSL, hslToHex } from "./hsl";

export interface MirrorSet {
  mirror_HSL: string;
  mirror_HSl: string;
  mirror_HsL: string;
  mirror_Hsl: string;
  mirror_hSL: string;
  mirror_hSl: string;
  mirror_hsL: string;
  mirror_gsheet: string;
  mirror_midpoint: string;
}

// Average Absolute Diff - Google Sheets dark vs light
// (calculated by avgHex)
//              737373    757171    |diff|    % diff
// Red          115       117         2       0.0172
// Green        115       113         2       0.0175
// Blue         115       113         2       0.0175
// Hue          0         0.8802    0.8802    2
// Saturation   0         0.0200    0.0200    2
// Lightness    0.4509    0.4511    0.0001    0.0003

const RGB_CHANGE = 113 + Math.round(Math.random() * 4);

const clampChannel = (n: number): number => Math.max(0, Math.min(255, n));

const clampedValue = (num: number, delta: number): string => {
  return decToHex(clampChannel(num + delta));
};

export const getGSheetsComp = (hex: string): string => {
  const rgb = hexStringToRGB(hex);
  const { lum } = getHSL(rgb);
  const delta = lum < 0.5 ? RGB_CHANGE : -RGB_CHANGE;
  const clampedRed = clampedValue(rgb.red, delta);
  const clampedGreen = clampedValue(rgb.green, delta);
  const clampedBlue = clampedValue(rgb.blue, delta);

  return `${clampedRed}${clampedGreen}${clampedBlue}`;
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
    mirror_gsheet: getGSheetsComp(hex),
    mirror_midpoint: getMidpointComp(hex),
  };
};

const RGB_MP = 255 / 2;
const HUE_MP = 360 / 2;
const SL_MP = 1 / 2;

export const getMidpointComp = (hex: string): string => {
  const { red, green, blue } = hexStringToRGB(hex);
  const rDiff = RGB_MP - red;
  const gDiff = RGB_MP - green;
  const bDiff = RGB_MP - blue;

  let rNew: number = RGB_MP,
    gNew: number = RGB_MP,
    bNew: number = RGB_MP;

  if (rDiff > RGB_MP) rNew -= rDiff;
  else rNew += rDiff;
  if (gDiff > RGB_MP) gNew -= gDiff;
  else gNew += gDiff;
  if (bDiff > RGB_MP) bNew -= bDiff;
  else bNew += bDiff;

  return `${decToHex(rNew)}${decToHex(gNew)}${decToHex(bNew)}`;
};
