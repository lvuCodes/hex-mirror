// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import "./ColorBox.css";
import { MirrorSet } from "../utils";

const poem = [
  "Excerpt from Annabel Lee by Edgar Allen Poe",
  "For the moon never beams, without bringing me dreams",
  "    Of the beautiful Annabel Lee;",
  "And the stars never rise, but I feel the bright eyes",
  "    Of the beautiful Annabel Lee;",
  "And so, all the night-tide, I lie down by the side",
  "    Of my darling—my darling—my life and my bride,",
  "    In her sepulchre there by the sea—",
  "    In her tomb by the sounding sea.",
];

const MIRROR_ROWS: { key: keyof MirrorSet; desc: string }[] = [
  { key: "mirror_HSL", desc: "Complementary hue, saturation, and lightness." },
  { key: "mirror_HSl", desc: "Complementary hue and saturation." },
  { key: "mirror_HsL", desc: "Complementary hue and lightness." },
  { key: "mirror_Hsl", desc: "Complementary hue." },
  { key: "mirror_hSL", desc: "Complementary saturation and lightness." },
  { key: "mirror_hSl", desc: "Complementary saturation." },
  { key: "mirror_hsL", desc: "Complementary lightness." },
  {
    key: "mirror_gsheet",
    desc: "A fixed shift of each RGB channel toward a lighter or darker sibling.",
  },
  {
    key: "mirror_midpoint",
    desc: "The photographic negative, inverting each RGB channel across the 0 to 255 range.",
  },
];

interface ColorBoxProps {
  set: MirrorSet;
}

const ColorBox = ({ set }: ColorBoxProps) => (
  <table className="color-box">
    <tbody>
      {MIRROR_ROWS.map(({ key, desc }, i) => {
        const hex = set[key];
        return (
          <tr key={key}>
            <td className="cell">
              <div className="hex">{`#${hex}:`}</div>
            </td>
            <td className="cell" style={{ color: `#${hex}` }}>
              {poem[i]}
            </td>
            <td className="desc">{desc}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default ColorBox;
