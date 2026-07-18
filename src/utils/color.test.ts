import { describe, it, expect } from "vitest";
import { getRandomHex, calculateHexAttr, isHexCode } from ".";

describe("getRandomHex", () => {
  it("returns a valid hex string with matching RGB channels in range", () => {
    const { hex, RGB } = getRandomHex();
    expect(isHexCode(hex)).toBe(true);
    for (const channel of [RGB.red, RGB.green, RGB.blue]) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
    }
  });
});

describe("calculateHexAttr", () => {
  it("builds a full ColorCard from raw channels", () => {
    const card = calculateHexAttr({ red: 18, green: 18, blue: 18 });
    expect(card.hex).toBe("121212");
    expect(card.RGB).toMatchObject({ red: 18, green: 18, blue: 18 });
    expect(isHexCode(card.mirrorSet.mirror_midpoint)).toBe(true);
  });
});
