export const arrayAvg = (arr: number[]): number =>
  arr.length === 0 ? 0 : arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const percentDiff = (a: number, b: number): number =>
  (a - b) / ((a + b) / 2);

export const absPercentDiff = (a: number, b: number): number =>
  Math.abs(percentDiff(a, b));

export const format = (n: number | undefined): string => {
  const v = n ?? 0;
  return String(Number.isFinite(v) ? v : 0).slice(0, 6);
};
