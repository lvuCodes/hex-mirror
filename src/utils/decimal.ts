import { decToHex } from "./hexadecimal";

export const getRandom256 = (): number => Math.floor(Math.random() * 256);

export const randomDecToHex = (): { dec: number; hex: string } => {
  const dec = getRandom256();
  return { dec, hex: decToHex(dec) };
};
