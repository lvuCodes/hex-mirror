import { describe, it, expect } from "vitest";
import { getComplementValues } from "./decimal";

describe("getComplementValues", () => {
  it("mirrors a channel value around 255", () => {
    expect(getComplementValues(0)).toEqual({ dec: 255, hex: "FF" });
    expect(getComplementValues(255)).toEqual({ dec: 0, hex: "00" });
    expect(getComplementValues(100)).toEqual({ dec: 155, hex: "9B" });
  });
});
