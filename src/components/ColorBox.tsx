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
  background-color: #efefef;
  border-radius: 10px;
  box-shadow: 2px 2px 2px grey;
  padding: 6px 8px;
  color: #121212;
  font-family: sans-serif;
`;

const Hex = styled.div`
  border-radius: 10px;
  background-color: #eeeeee;
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

const desc = [
  "Complementary hue, saturation, and lightness.",
  "Complementary hue and saturation.",
  "Complementary hue and lightness.",
  "Complementary hue.",
  "Complementary saturation and lightness.",
  "Complementary saturation.",
  "Complementary lightness.",
  "A fixed shift of each RGB channel toward a lighter or darker sibling.",
  "The photographic negative, inverting each RGB channel across the 0 to 255 range.",
];

interface ColorBoxProps {
  set: MirrorSet;
}

const ColorBox = ({ set }: ColorBoxProps) => {
  const hexSet = Object.values(set);
  return (
    <StyledColorBox>
      <tbody>
        {poem.map((line, i) => (
          <tr key={i}>
            <Cell>
              <Hex>{`#${hexSet[i]}:`}</Hex>
            </Cell>
            <Cell style={{ color: `#${hexSet[i]}` }}>{line}</Cell>
            <DescCell className="desc">{desc[i]}</DescCell>
          </tr>
        ))}
      </tbody>
    </StyledColorBox>
  );
};

export default ColorBox;
