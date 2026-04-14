export interface RGBValues {
  red: number;
  green: number;
  blue: number;
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
  mirror_hsl: string;
}

export interface ColorCard {
  hex: string;
  RGB: RGBValues;
  RGBComp: RGBValues;
  HSL: HSLValues;
  HSLComp: HSLValues;
  mirrorSet: MirrorSet;
}

export interface HexEntry {
  hex: string;
  RGB?: RGBValues;
  HSL?: HSLValues;
}

export interface CompareItem {
  hexA: HexEntry;
  hexB: HexEntry;
}

export const isHexCode = (input: string) => {
  const hexRegex: RegExp = /^([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(input);
};

const decToHex = (num: number): string => {
  return num.toString(16).padStart(2, "0").toUpperCase();
};

const hexToDec = (hex: string): number => {
  return parseInt(hex, 16);
};

export const getRandom256 = (): number => {
  return Math.floor(Math.random() * 255);
};

export const randomDecToHex = (): { dec: number; hex: string } => {
  const dec = getRandom256();
  return { dec, hex: decToHex(dec) };
};

const getComplementValues = (num: number): { dec: number; hex: string } => {
  return { dec: 255 - num, hex: decToHex(255 - num) };
};

const getHSL = ({
  red,
  green,
  blue,
}: {
  red: number;
  green: number;
  blue: number;
}): { hue: number; sat: number; lum: number } => {
  const rNorm = red / 255;
  const gNorm = green / 255;
  const bNorm = blue / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  const lum = (min + max) / 2;
  const sat = diff == 0 ? 0 : diff / (1 - Math.abs(2 * lum - 1));

  let hue = 0;
  if (diff != 0) {
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
      default:
        break;
    }
  }
  if (hue < 0) hue += 360;

  return { hue, sat, lum };
};

const hslToHex = ({
  hue,
  sat,
  lum,
}: {
  hue: number;
  sat: number;
  lum: number;
}): string => {
  const chroma = (1 - Math.abs(2 * lum - 1)) * sat;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const offset = lum - chroma / 2;

  let red = 0,
    green = 0,
    blue = 0;
  if (hue < 60) {
    red = chroma;
    green = secondary;
    blue = 0;
  } else if (hue < 120) {
    red = secondary;
    green = chroma;
    blue = 0;
  } else if (hue < 180) {
    red = 0;
    green = chroma;
    blue = secondary;
  } else if (hue < 240) {
    red = 0;
    green = secondary;
    blue = chroma;
  } else if (hue < 300) {
    red = secondary;
    green = 0;
    blue = chroma;
  } else {
    red = chroma;
    green = 0;
    blue = secondary;
  }

  const R = decToHex(Math.round((red + offset) * 255));
  const G = decToHex(Math.round((green + offset) * 255));
  const B = decToHex(Math.round((blue + offset) * 255));

  return `${R}${G}${B}`;
};

const getMirrorSet = ({
  hue,
  sat,
  lum,
}: {
  hue: number;
  sat: number;
  lum: number;
}) => {
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
    mirror_hsl: getGSheetsComp(hex), // this is actually the same as the og hex
    // mirror_hsl is the same as the OG hex
    // so we replace with the Google Sheet Complement
  };
};

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

const hexStringToRGB = (
  hex: string
): { red: number; green: number; blue: number } => ({
  red: hexToDec(hex.slice(0, 2)),
  green: hexToDec(hex.slice(2, 4)),
  blue: hexToDec(hex.slice(4, 6)),
});

const avgHex = (list: CompareItem[]): CompareItem => {
  let length = list.length;
  const redSum: number[] = [],
    greenSum: number[] = [],
    blueSum: number[] = [],
    hueSum: number[] = [],
    satSum: number[] = [],
    lumSum: number[] = [],
    redPercent: number[] = [],
    greenPercent: number[] = [],
    bluePercent: number[] = [],
    huePercent: number[] = [],
    satPercent: number[] = [],
    lumPercent: number[] = [];
  list.map(({ hexA, hexB }) => {
    if (hexA.hex == hexB.hex) {
      length -= 1;
      return;
    }
    const redAbsDiff = Math.abs((hexA.RGB?.red || 0) - (hexB.RGB?.red || 0));
    const greenAbsDiff = Math.abs(
      (hexA.RGB?.green || 0) - (hexB.RGB?.green || 0)
    );
    const blueAbsDiff = Math.abs((hexA.RGB?.blue || 0) - (hexB.RGB?.blue || 0));
    const hueAbsDiff = Math.abs((hexA.HSL?.hue || 0) - (hexB.HSL?.hue || 0));
    const satAbsDiff = Math.abs((hexA.HSL?.sat || 0) - (hexB.HSL?.sat || 0));
    const lumAbsDiff = Math.abs((hexA.HSL?.lum || 0) - (hexB.HSL?.lum || 0));

    redSum.push(redAbsDiff);
    greenSum.push(greenAbsDiff);
    blueSum.push(blueAbsDiff);
    hueSum.push(hueAbsDiff);
    satSum.push(satAbsDiff);
    lumSum.push(lumAbsDiff);

    const rPercent =
      redAbsDiff / ((hexA.RGB?.red || 0) + (hexB.RGB?.red || 0) / 2);
    const bPercent =
      greenAbsDiff / ((hexA.RGB?.green || 0) + (hexB.RGB?.green || 0) / 2);
    const gPercent =
      blueAbsDiff / ((hexA.RGB?.blue || 0) + (hexB.RGB?.blue || 0) / 2);
    const hPercent =
      hueAbsDiff / ((hexA.HSL?.hue || 0) + (hexB.HSL?.hue || 0) / 2);
    const sPercent =
      satAbsDiff / ((hexA.HSL?.sat || 0) + (hexB.HSL?.sat || 0) / 2);
    const lPercent =
      lumAbsDiff / ((hexA.HSL?.lum || 0) + (hexB.HSL?.lum || 0) / 2);

    redPercent.push(rPercent);
    greenPercent.push(bPercent);
    bluePercent.push(gPercent);
    huePercent.push(hPercent);
    satPercent.push(sPercent);
    lumPercent.push(lPercent);
  });

  // arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const redAvg = Math.round(redSum.reduce((sum, val) => sum + val, 0) / length);
  const greenAvg = Math.round(
    greenSum.reduce((sum, val) => sum + val, 0) / length
  );
  const blueAvg = Math.round(
    blueSum.reduce((sum, val) => sum + val, 0) / length
  );
  const hueAvg = hueSum.reduce((sum, val) => sum + val, 0) / length;
  const satAvg = satSum.reduce((sum, val) => sum + val, 0) / length;
  const lumAvg = lumSum.reduce((sum, val) => sum + val, 0) / length;
  console.log(
    "redPercDiffAvg:",
    redPercent.reduce((sum, val) => sum + val, 0) / length
  );
  console.log(
    "greenPercDiffAvg:",
    greenPercent.reduce((sum, val) => sum + val, 0) / length
  );
  console.log(
    "bluePercDiffAvg:",
    bluePercent.reduce((sum, val) => sum + val, 0) / length
  );
  console.log(
    "huePercDiffAvg:",
    huePercent.reduce((sum, val) => sum + val, 0) / length
  );
  console.log(
    "satPercDiffAvg:",
    satPercent.reduce((sum, val) => sum + val, 0) / length
  );
  console.log(
    "lumPercDiffAvg:",
    lumPercent.reduce((sum, val) => sum + val, 0) / length
  );

  return {
    hexA: {
      hex: `${decToHex(redAvg)}${decToHex(greenAvg)}${decToHex(blueAvg)}`,
      RGB: {
        red: redAvg,
        green: greenAvg,
        blue: blueAvg,
      },
      HSL: getHSL({ red: redAvg, green: greenAvg, blue: blueAvg }),
    },
    hexB: {
      hex: hslToHex({ hue: hueAvg, sat: satAvg, lum: lumAvg }),
      RGB: {
        red: hexStringToRGB(hslToHex({ hue: hueAvg, sat: satAvg, lum: lumAvg }))
          .red,
        green: hexStringToRGB(
          hslToHex({ hue: hueAvg, sat: satAvg, lum: lumAvg })
        ).green,
        blue: hexStringToRGB(
          hslToHex({ hue: hueAvg, sat: satAvg, lum: lumAvg })
        ).blue,
      },
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

// Average Absolute Diff - Google Sheets dark vs light
//              737373    757171    |diff|    % diff
// Red          115       117         2       0.0172
// Green        115       113         2       0.0175
// Blue         115       113         2       0.0175
// Hue          0         0.8802    0.8802    2
// Saturation   0         0.0200    0.0200    2
// Lightness    0.4509    0.4511    0.0001    0.0003

const RGB_CHANGE = 113 + Math.round(Math.random() * 4);
const HUE_CHANGE = 0.88;
const SAT_CHANGE = 0.02;
const LUM_CHANGE =
  0.4 + Number.parseFloat(String(Math.random() * 0.1).slice(0, 6));

const getGSheetsComp = (hex: string): string => {
  const rgb = hexStringToRGB(hex);
  const hsl = getHSL(rgb);
  const { lum } = hsl;

  const change = lum < 0.5 ? "light" : "dark"; // low lum = dark

  let redNew: number = rgb.red,
    greenNew: number = rgb.green,
    blueNew: number = rgb.blue,
    hueNew: number = hsl.hue,
    satNew: number = hsl.sat,
    lumNew: number = hsl.lum;

  if (change == "light") {
    redNew += RGB_CHANGE;
    greenNew += RGB_CHANGE;
    blueNew += RGB_CHANGE;
    hueNew += HUE_CHANGE;
    satNew += SAT_CHANGE;
    lumNew += LUM_CHANGE;
  } else {
    redNew -= RGB_CHANGE;
    greenNew -= RGB_CHANGE;
    blueNew -= RGB_CHANGE;
    hueNew -= HUE_CHANGE;
    satNew -= SAT_CHANGE;
    lumNew -= LUM_CHANGE;
  }

  return `${decToHex(redNew)}${decToHex(greenNew)}${decToHex(blueNew)}`;
};

const RGB_MP = 255 / 2;
const HUE_MP = 360 / 2;
const SL_MP = 1 / 2;

const getPercentDiffComp = (hex: string): string => {
  const rgb = hexStringToRGB(hex);

  return hex;
};
