import { describe, it, expect } from "vitest";
import { populateHexEntry, populateHexList } from "./compare";

describe("populateHexEntry", () => {
  it("fills in RGB (with hex channels) and HSL from a hex string", () => {
    const entry = populateHexEntry({ hex: "FF8000" });
    expect(entry.hex).toBe("FF8000");
    expect(entry.RGB).toMatchObject({
      red: 255,
      green: 128,
      blue: 0,
      R: "FF",
      G: "80",
      B: "00",
    });
    expect(entry.HSL).toBeDefined();
    expect(entry.HSL?.lum).toBeCloseTo(0.5);
  });
});

describe("populateHexList", () => {
  it("populates each pair and appends one averaged entry", () => {
    const result = populateHexList([
      { hexA: { hex: "000000" }, hexB: { hex: "FFFFFF" } },
      { hexA: { hex: "112233" }, hexB: { hex: "445566" } },
    ]);

    expect(result).toHaveLength(3);
    expect(result[0].hexA.RGB).toBeDefined();
    expect(result[0].hexA.HSL).toBeDefined();
  });
});
