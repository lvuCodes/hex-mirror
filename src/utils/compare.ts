import { decToHex, hexStringToRGB } from "./hex";
import { getHSL, hslToHex } from "./hsl";
import { RGBValues } from "./rgb";
import { HSLValues } from "./hsl";
import { arrayAvg, absPercentDiff } from "./calc";

export interface HexEntry {
  hex: string;
  RGB?: RGBValues;
  HSL?: HSLValues;
}

export interface CompareItem {
  hexA: HexEntry;
  hexB: HexEntry;
}

const avgHex = (list: CompareItem[]): CompareItem => {
  const redDiffs: number[] = [],
    greenDiffs: number[] = [],
    blueDiffs: number[] = [],
    hueDiffs: number[] = [],
    satDiffs: number[] = [],
    lumDiffs: number[] = [],
    redPercents: number[] = [],
    greenPercents: number[] = [],
    bluePercents: number[] = [],
    huePercents: number[] = [],
    satPercents: number[] = [],
    lumPercents: number[] = [];

  list.forEach(({ hexA, hexB }) => {
    if (hexA.hex === hexB.hex) return;

    const rA = hexA.RGB?.red ?? 0,
      rB = hexB.RGB?.red ?? 0;
    const gA = hexA.RGB?.green ?? 0,
      gB = hexB.RGB?.green ?? 0;
    const bA = hexA.RGB?.blue ?? 0,
      bB = hexB.RGB?.blue ?? 0;
    const hA = hexA.HSL?.hue ?? 0,
      hB = hexB.HSL?.hue ?? 0;
    const sA = hexA.HSL?.sat ?? 0,
      sB = hexB.HSL?.sat ?? 0;
    const lA = hexA.HSL?.lum ?? 0,
      lB = hexB.HSL?.lum ?? 0;

    redDiffs.push(Math.abs(rA - rB));
    greenDiffs.push(Math.abs(gA - gB));
    blueDiffs.push(Math.abs(bA - bB));
    hueDiffs.push(Math.abs(hA - hB));
    satDiffs.push(Math.abs(sA - sB));
    lumDiffs.push(Math.abs(lA - lB));

    redPercents.push(absPercentDiff(rA, rB));
    greenPercents.push(absPercentDiff(gA, gB));
    bluePercents.push(absPercentDiff(bA, bB));
    huePercents.push(absPercentDiff(hA, hB));
    satPercents.push(absPercentDiff(sA, sB));
    lumPercents.push(absPercentDiff(lA, lB));
  });

  const redAvg = Math.round(arrayAvg(redDiffs));
  const greenAvg = Math.round(arrayAvg(greenDiffs));
  const blueAvg = Math.round(arrayAvg(blueDiffs));
  const hueAvg = arrayAvg(hueDiffs);
  const satAvg = arrayAvg(satDiffs);
  const lumAvg = arrayAvg(lumDiffs);

  // console.log("redPercDiffAvg:", arrayAvg(redPercents));
  // console.log("greenPercDiffAvg:", arrayAvg(greenPercents));
  // console.log("bluePercDiffAvg:", arrayAvg(bluePercents));
  // console.log("huePercDiffAvg:", arrayAvg(huePercents));
  // console.log("satPercDiffAvg:", arrayAvg(satPercents));
  // console.log("lumPercDiffAvg:", arrayAvg(lumPercents));

  const hexBStr = hslToHex({ hue: hueAvg, sat: satAvg, lum: lumAvg });
  const hexBRGB = hexStringToRGB(hexBStr);

  return {
    hexA: {
      hex: `${decToHex(redAvg)}${decToHex(greenAvg)}${decToHex(blueAvg)}`,
      RGB: { red: redAvg, green: greenAvg, blue: blueAvg },
      HSL: getHSL({ red: redAvg, green: greenAvg, blue: blueAvg }),
    },
    hexB: {
      hex: hexBStr,
      RGB: hexBRGB,
      HSL: { hue: hueAvg, sat: satAvg, lum: lumAvg },
    },
  };
};

export const populateState = (initial: CompareItem[]): CompareItem[] => {
  const newList: CompareItem[] = initial.map(({ hexA, hexB }) => {
    const rgbA = hexStringToRGB(hexA.hex);
    const rgbB = hexStringToRGB(hexB.hex);
    return {
      hexA: {
        hex: hexA.hex,
        RGB: {
          ...rgbA,
          R: decToHex(rgbA.red),
          G: decToHex(rgbA.green),
          B: decToHex(rgbA.blue),
        },
        HSL: getHSL(rgbA),
      },
      hexB: {
        hex: hexB.hex,
        RGB: {
          ...rgbB,
          R: decToHex(rgbB.red),
          G: decToHex(rgbB.green),
          B: decToHex(rgbB.blue),
        },
        HSL: getHSL(rgbB),
      },
    };
  });

  newList.push(avgHex(newList));

  return newList;
};
