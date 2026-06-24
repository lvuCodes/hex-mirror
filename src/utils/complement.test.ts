import { describe, it, expect } from "vitest";
import { getMidpointComp, getMirrorSet } from "./complement";
import { getHSL } from "./hsl";
import { hexStringToRGB } from "./hexadecimal";

const HEX_6 = /^[0-9A-F]{6}$/;

describe("getMidpointComp", () => {
  it("reflects each channel across the midpoint", () => {
    expect(getMidpointComp("000000")).toBe("FFFFFF");
    expect(getMidpointComp("FFFFFF")).toBe("000000");
  });

  it("returns a well-formed 6-digit hex string", () => {
    expect(getMidpointComp("3366CC")).toMatch(HEX_6);
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
