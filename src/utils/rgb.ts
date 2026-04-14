import { decToHex } from "./hex";
import { randomDecToHex, getComplementValues } from "./dec";
import { HSLValues, MirrorSet, getHSL, getMirrorSet } from "./hsl";

export interface RGBValues {
  red: number;
  green: number;
  blue: number;
  R?: string;
  G?: string;
  B?: string;
}

export interface ColorCard {
  hex: string;
  RGB: RGBValues;
  RGBComp: RGBValues;
  HSL: HSLValues;
  HSLComp: HSLValues;
  mirrorSet: MirrorSet;
}

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
