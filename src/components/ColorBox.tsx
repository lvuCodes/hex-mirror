import styled from "styled-components";
import { MirrorSet } from "../utils";

const StyledColorBox = styled.table`
  margin: 12px;
  border-collapse: separate;
  border-spacing: 12px;
  font-size: 1rem;
  text-align: left;
  white-space: pre-wrap;
  font-weight: bold;
  vertical-align: middle;
`;

const Cell = styled.td`
  vertical-align: middle;
`;

const DescCell = styled.td`
  background-color: #D8D8D8;
  border-radius: 10px;
  box-shadow: 2px 2px 2px grey;
  padding: 6px 8px;
  color: #121212;
  font-family: sans-serif;
`;

const Hex = styled.div`
  border-radius: 10px;
  background-color: #D8D8D8;
  padding: 4px 6px;
  box-shadow: 2px 2px 2px grey;
  font-weight: normal;
  text-wrap: nowrap;
`;

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
  <StyledColorBox>
    <tbody>
      {MIRROR_ROWS.map(({ key, desc }, i) => {
        const hex = set[key];
        return (
          <tr key={key}>
            <Cell>
              <Hex>{`#${hex}:`}</Hex>
            </Cell>
            <Cell style={{ color: `#${hex}` }}>{poem[i]}</Cell>
            <DescCell className="desc">{desc}</DescCell>
          </tr>
        );
      })}
    </tbody>
  </StyledColorBox>
);

export default ColorBox;
