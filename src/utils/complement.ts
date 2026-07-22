// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { decToHex, hexStringToRGB, rgbToHexString } from "./hexadecimal";
import { getHSL, hslToHex, complementHSL } from "./hsl";
import type { HSLValues, MirrorSet } from "./types";

/** The 8-bit complement of a single channel — reflecting v across the 0–255 range (255 − v). */
export const complementChannel = (v: number): number => 255 - v;

/** The 0–255 complement of a single channel, with its hex form. */
export const getComplementValues = (num: number): { dec: number; hex: string } => {
  const dec = complementChannel(num);
  return { dec, hex: decToHex(dec) };
};

// Average Absolute Diff - Google Sheets dark vs light
// (calculated by avgHex)
//              737373    757171    |diff|    % diff
// Red          115       117         2       0.0172
// Green        115       113         2       0.0175
// Blue         115       113         2       0.0175
// Hue          0         0.8802    0.8802    2
// Saturation   0         0.0200    0.0200    2
// Lightness    0.4509    0.4511    0.0001    0.0003

// 115 is the observed mean of the per-channel shift (the 113–117 spread above);
// fixed rather than randomized so the mirror is deterministic and importing this
// module has no side effect.
const RGB_CHANGE = 115;

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

/** Reflect each RGB channel across the 0–255 midpoint — identical to the channel complement (255 − v). */
export const getMidpointComp = (hex: string): string => {
  const { red, green, blue } = hexStringToRGB(hex);
  return rgbToHexString({
    red: complementChannel(red),
    green: complementChannel(green),
    blue: complementChannel(blue),
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
