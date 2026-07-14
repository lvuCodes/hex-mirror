import { describe, it, expect } from "vitest";
import { getRandom256 } from "./decimal";

describe("getRandom256", () => {
  it("returns an integer within [0, 255]", () => {
    for (let i = 0; i < 100; i++) {
      const n = getRandom256();
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(255);
    }
  });
});
