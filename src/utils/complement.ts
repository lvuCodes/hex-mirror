import { decToHex, hexStringToRGB, rgbToHexString } from "./hexadecimal";
import { getHSL, hslToHex, complementHSL } from "./hsl";
import type { HSLValues, MirrorSet } from "./types";

/** The 0–255 complement of a single channel, with its hex form. */
export const getComplementValues = (
  num: number
): { dec: number; hex: string } => ({
  dec: 255 - num,
  hex: decToHex(255 - num),
});

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
const RGB_MIDPOINT = 255 / 2;

const clampChannel = (n: number): number => Math.max(0, Math.min(255, n));

export const getGSheetsComp = (hex: string): string => {
  const { red, green, blue } = hexStringToRGB(hex);
  const { lum } = getHSL({ red, green, blue });
  const delta = lum < 0.5 ? RGB_CHANGE : -RGB_CHANGE;
  return rgbToHexString({
    red: clampChannel(red + delta),
    green: clampChannel(green + delta),
    blue: clampChannel(blue + delta),
  });
};

/** Reflect each RGB channel across the 0–255 midpoint (equivalent to 255 − v). */
export const getMidpointComp = (hex: string): string => {
  const { red, green, blue } = hexStringToRGB(hex);
  const reflect = (v: number): number => 2 * RGB_MIDPOINT - v;
  return rgbToHexString({
    red: reflect(red),
    green: reflect(green),
    blue: reflect(blue),
  });
};

export const getMirrorSet = (hsl: HSLValues): MirrorSet => {
  const { hue, sat, lum } = hsl;
  const { hue: hueComp, sat: satComp, lum: lumComp } = complementHSL(hsl);
  const hex = hslToHex(hsl);

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
