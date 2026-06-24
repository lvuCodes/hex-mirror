import { describe, it, expect } from "vitest";
import { decToHex, hexToDec, hexStringToRGB, isHexCode } from "./hexadecimal";

describe("decToHex", () => {
  it("pads to two digits and uppercases", () => {
    expect(decToHex(0)).toBe("00");
    expect(decToHex(10)).toBe("0A");
    expect(decToHex(255)).toBe("FF");
  });
});

describe("hexToDec", () => {
  it("parses a hex pair to a decimal", () => {
    expect(hexToDec("00")).toBe(0);
    expect(hexToDec("FF")).toBe(255);
    expect(hexToDec("0A")).toBe(10);
  });

  it("round-trips with decToHex", () => {
    for (const n of [0, 1, 16, 128, 200, 255]) {
      expect(hexToDec(decToHex(n))).toBe(n);
    }
  });
});

describe("hexStringToRGB", () => {
  it("splits a 6-digit hex into red, green, blue channels", () => {
    expect(hexStringToRGB("FF8000")).toEqual({ red: 255, green: 128, blue: 0 });
    expect(hexStringToRGB("000000")).toEqual({ red: 0, green: 0, blue: 0 });
    expect(hexStringToRGB("FFFFFF")).toEqual({
      red: 255,
      green: 255,
      blue: 255,
    });
  });
});

describe("isHexCode", () => {
  it("accepts 3- and 6-digit hex codes", () => {
    expect(isHexCode("FFF")).toBe(true);
    expect(isHexCode("abc")).toBe(true);
    expect(isHexCode("FF8000")).toBe(true);
    expect(isHexCode("000000")).toBe(true);
  });

  it("rejects malformed input", () => {
    expect(isHexCode("GGG")).toBe(false);
    expect(isHexCode("12345")).toBe(false);
    expect(isHexCode("#FFF")).toBe(false);
    expect(isHexCode("")).toBe(false);
  });
});
