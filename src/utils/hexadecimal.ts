// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import type { RGBChannels, RGBValues } from "./types";

export const decToHex = (num: number): string => num.toString(16).padStart(2, "0").toUpperCase();

export const hexToDec = (hex: string): number => parseInt(hex, 16);

export const hexStringToRGB = (hex: string): RGBChannels => {
  if (!isHexCode(hex)) {
    throw new Error(`hexStringToRGB: "${hex}" is not a 3- or 6-digit hex color`);
  }
  // Expand 3-digit shorthand ("abc" → "aabbcc") so it round-trips like 6-digit.
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return {
    red: hexToDec(full.slice(0, 2)),
    green: hexToDec(full.slice(2, 4)),
    blue: hexToDec(full.slice(4, 6)),
  };
};

/** Attach two-digit hex channels (R/G/B) to a set of RGB numbers. */
export const toRGBValues = ({ red, green, blue }: RGBChannels): RGBValues => ({
  red,
  green,
  blue,
  R: decToHex(red),
  G: decToHex(green),
  B: decToHex(blue),
});

/** Serialize RGB channels to a `RRGGBB` hex string. */
export const rgbToHexString = ({ red, green, blue }: RGBChannels): string =>
  `${decToHex(red)}${decToHex(green)}${decToHex(blue)}`;

export const isHexCode = (input: string): boolean => {
  const hexRegex = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};
