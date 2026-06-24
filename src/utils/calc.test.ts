import { describe, it, expect } from "vitest";
import { arrayAvg, percentDiff, absPercentDiff, format } from "./calc";

describe("arrayAvg", () => {
  it("averages a list of numbers", () => {
    expect(arrayAvg([1, 2, 3])).toBe(2);
    expect(arrayAvg([10])).toBe(10);
  });
});

describe("percentDiff / absPercentDiff", () => {
  it("is zero for equal values", () => {
    expect(percentDiff(50, 50)).toBe(0);
    expect(absPercentDiff(50, 50)).toBe(0);
  });

  it("absPercentDiff is symmetric and non-negative", () => {
    expect(absPercentDiff(80, 100)).toBeCloseTo(absPercentDiff(100, 80));
    expect(absPercentDiff(100, 80)).toBeGreaterThan(0);
  });
});

describe("format", () => {
  it("renders undefined as '0'", () => {
    expect(format(undefined)).toBe("0");
  });

  it("truncates to six characters", () => {
    expect(format(3.1415926)).toBe("3.1415");
    expect(format(255)).toBe("255");
  });
});
