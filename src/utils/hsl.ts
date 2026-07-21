// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { rgbToHexString } from "./hexadecimal";
import type { RGBChannels, HSLValues } from "./types";

export const getHSL = ({ red, green, blue }: RGBChannels): HSLValues => {
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

/** Complement each HSL component around its own range. */
export const complementHSL = ({ hue, sat, lum }: HSLValues): HSLValues => ({
  hue: 360 - hue,
  sat: 1 - sat,
  lum: 1 - lum,
});

export const hslToHex = ({ hue, sat, lum }: HSLValues): string => {
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

  return rgbToHexString({
    red: Math.round((red + offset) * 255),
    green: Math.round((green + offset) * 255),
    blue: Math.round((blue + offset) * 255),
  });
};
