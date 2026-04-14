import { decToHex } from "./hex";

export const getRandom256 = (): number => Math.floor(Math.random() * 255);

export const randomDecToHex = (): { dec: number; hex: string } => {
  const dec = getRandom256();
  return { dec, hex: decToHex(dec) };
};

export const getComplementValues = (
  num: number
): { dec: number; hex: string } => ({
  dec: 255 - num,
  hex: decToHex(255 - num),
});
