export const arrayAvg = (arr: number[]): number =>
  arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const absPercentDiff = (a: number, b: number): number =>
  Math.abs(absPercentDiff(a, b));

export const percentDiff = (a: number, b: number): number =>
  (a - b) / ((a + b) / 2);

export const format = (n: number | undefined): string =>
  String(n ?? 0).slice(0, 6);
