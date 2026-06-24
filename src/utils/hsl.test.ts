import { describe, it, expect } from "vitest";
import { getHSL, hslToHex } from "./hsl";
import { hexStringToRGB } from "./hexadecimal";

describe("getHSL", () => {
  it("computes pure red", () => {
    const { hue, sat, lum } = getHSL({ red: 255, green: 0, blue: 0 });
    expect(hue).toBe(0);
    expect(sat).toBe(1);
    expect(lum).toBe(0.5);
  });

  it("computes white (lum 1, sat 0)", () => {
    const { sat, lum } = getHSL({ red: 255, green: 255, blue: 255 });
    expect(lum).toBe(1);
    expect(sat).toBe(0);
  });

  it("computes black (lum 0)", () => {
    const { lum } = getHSL({ red: 0, green: 0, blue: 0 });
    expect(lum).toBe(0);
  });

  it("computes gray (sat 0)", () => {
    const { sat } = getHSL({ red: 128, green: 128, blue: 128 });
    expect(sat).toBe(0);
  });

  it("places green and blue hues in their sextants", () => {
    expect(getHSL({ red: 0, green: 255, blue: 0 }).hue).toBe(120);
    expect(getHSL({ red: 0, green: 0, blue: 255 }).hue).toBe(240);
  });
});

describe("hslToHex", () => {
  it("round-trips through getHSL within one unit per channel", () => {
    for (const hex of ["FF8000", "3366CC", "12AB9F", "808080", "00FF00"]) {
      const original = hexStringToRGB(hex);
      const result = hexStringToRGB(hslToHex(getHSL(original)));
      expect(Math.abs(result.red - original.red)).toBeLessThanOrEqual(1);
      expect(Math.abs(result.green - original.green)).toBeLessThanOrEqual(1);
      expect(Math.abs(result.blue - original.blue)).toBeLessThanOrEqual(1);
    }
  });
});
