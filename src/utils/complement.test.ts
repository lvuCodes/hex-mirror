import { describe, it, expect } from "vitest";
import { getComplementValues, getGSheetsComp, getMidpointComp, getMirrorSet } from "./complement";
import { getHSL } from "./hsl";
import { hexStringToRGB } from "./hexadecimal";

const HEX_6 = /^[0-9A-F]{6}$/;

describe("getComplementValues", () => {
  it("mirrors a channel value around 255", () => {
    expect(getComplementValues(0)).toEqual({ dec: 255, hex: "FF" });
    expect(getComplementValues(255)).toEqual({ dec: 0, hex: "00" });
    expect(getComplementValues(100)).toEqual({ dec: 155, hex: "9B" });
  });
});

describe("getMidpointComp", () => {
  it("reflects each channel across the midpoint", () => {
    expect(getMidpointComp("000000")).toBe("FFFFFF");
    expect(getMidpointComp("FFFFFF")).toBe("000000");
  });

  it("returns a well-formed 6-digit hex string", () => {
    expect(getMidpointComp("3366CC")).toMatch(HEX_6);
  });
});

describe("getGSheetsComp", () => {
  it("is deterministic — shifts each channel by the fixed 115 toward the opposite band", () => {
    // 3366CC → rgb(51,102,204), lum 0.5 (not < 0.5) ⇒ delta −115 ⇒ (0,0,89).
    expect(getGSheetsComp("3366CC")).toBe("000059");
    expect(getGSheetsComp("3366CC")).toBe(getGSheetsComp("3366CC"));
  });
});

describe("getMirrorSet", () => {
  const mirrorSet = getMirrorSet(getHSL(hexStringToRGB("3366CC")));

  it("exposes all nine mirror variants", () => {
    expect(Object.keys(mirrorSet)).toEqual([
      "mirror_HSL",
      "mirror_HSl",
      "mirror_HsL",
      "mirror_Hsl",
      "mirror_hSL",
      "mirror_hSl",
      "mirror_hsL",
      "mirror_gsheet",
      "mirror_midpoint",
    ]);
  });

  it("produces well-formed hex strings for every variant", () => {
    for (const value of Object.values(mirrorSet)) {
      expect(value).toMatch(HEX_6);
    }
  });
});
