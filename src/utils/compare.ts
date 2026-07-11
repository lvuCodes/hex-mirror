import { hexStringToRGB, rgbToHexString, toRGBValues } from "./hexadecimal";
import { getHSL, hslToHex } from "./hsl";
import { arrayAvg } from "./calc";
import type { HexEntry, CompareItem } from "./types";

/** Mean of the absolute per-pair difference of one picked metric, ignoring identical pairs. */
const avgAbsDiff = (
  list: CompareItem[],
  pick: (entry: HexEntry) => number
): number => {
  const diffs = list
    .filter(({ hexA, hexB }) => hexA.hex !== hexB.hex)
    .map(({ hexA, hexB }) => Math.abs(pick(hexA) - pick(hexB)));
  return arrayAvg(diffs);
};

const rgbPick =
  (key: "red" | "green" | "blue") =>
  (entry: HexEntry): number =>
    entry.RGB?.[key] ?? 0;
const hslPick =
  (key: "hue" | "sat" | "lum") =>
  (entry: HexEntry): number =>
    entry.HSL?.[key] ?? 0;

const avgHex = (list: CompareItem[]): CompareItem => {
  const redAvg = Math.round(avgAbsDiff(list, rgbPick("red")));
  const greenAvg = Math.round(avgAbsDiff(list, rgbPick("green")));
  const blueAvg = Math.round(avgAbsDiff(list, rgbPick("blue")));
  const hueAvg = avgAbsDiff(list, hslPick("hue"));
  const satAvg = avgAbsDiff(list, hslPick("sat"));
  const lumAvg = avgAbsDiff(list, hslPick("lum"));

  const rgbAvg = { red: redAvg, green: greenAvg, blue: blueAvg };
  const hslAvg = { hue: hueAvg, sat: satAvg, lum: lumAvg };
  const hexBStr = hslToHex(hslAvg);

  return {
    hexA: {
      hex: rgbToHexString(rgbAvg),
      RGB: toRGBValues(rgbAvg),
      HSL: getHSL(rgbAvg),
    },
    hexB: {
      hex: hexBStr,
      RGB: toRGBValues(hexStringToRGB(hexBStr)),
      HSL: hslAvg,
    },
  };
};

export const populateHexEntry = (entry: HexEntry): HexEntry => {
  const rgb = hexStringToRGB(entry.hex);
  return {
    hex: entry.hex,
    RGB: toRGBValues(rgb),
    HSL: getHSL(rgb),
  };
};

export const populateHexList = (initial: CompareItem[]): CompareItem[] => {
  const newList: CompareItem[] = initial.map(({ hexA, hexB }) => ({
    hexA: populateHexEntry(hexA),
    hexB: populateHexEntry(hexB),
  }));

  newList.push(avgHex(newList));

  return newList;
};
