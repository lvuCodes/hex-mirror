// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

// Centralized domain types for color values and comparison data.

/** The three raw 0–255 RGB channels — the primitive color input shape. */
export interface RGBChannels {
  red: number;
  green: number;
  blue: number;
}

/** RGB channels plus their optional two-digit hex representations. */
export interface RGBValues extends RGBChannels {
  R?: string;
  G?: string;
  B?: string;
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
  mirror_gsheet: string;
  mirror_midpoint: string;
}

export interface ColorCard {
  hex: string;
  RGB: RGBValues;
  RGBComp: RGBValues;
  HSL: HSLValues;
  HSLComp: HSLValues;
  mirrorSet: MirrorSet;
}
