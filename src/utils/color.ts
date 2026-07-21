// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { toRGBValues, rgbToHexString } from "./hexadecimal";
import { getRandom256 } from "./decimal";
import { getComplementValues, getMirrorSet } from "./complement";
import { getHSL, complementHSL } from "./hsl";
import type { ColorCard, RGBChannels } from "./types";

/** A random color, as its hex string and populated RGB values. */
export const getRandomHex = (): {
  hex: string;
  RGB: ReturnType<typeof toRGBValues>;
} => {
  const channels: RGBChannels = {
    red: getRandom256(),
    green: getRandom256(),
    blue: getRandom256(),
  };
  return { hex: rgbToHexString(channels), RGB: toRGBValues(channels) };
};

/** Build the full ColorCard (RGB, complements, HSL, mirror set) from raw channels. */
export const calculateHexAttr = (channels: RGBChannels): ColorCard => {
  const HSL = getHSL(channels);
  const complement = ({ red, green, blue }: RGBChannels): RGBChannels => ({
    red: getComplementValues(red).dec,
    green: getComplementValues(green).dec,
    blue: getComplementValues(blue).dec,
  });

  return {
    hex: rgbToHexString(channels),
    RGB: toRGBValues(channels),
    RGBComp: toRGBValues(complement(channels)),
    HSL,
    HSLComp: complementHSL(HSL),
    mirrorSet: getMirrorSet(HSL),
  };
};
