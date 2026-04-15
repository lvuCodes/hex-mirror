import styled from "styled-components";
import { MirrorSet } from "../utils";

const StyledColorBox = styled.div`
  max-width: 90%;
  border-radius: 10px;
  margin: 20px auto;
  align-items: baseline;
  font-size: 1rem;
  text-align: left;
  white-space: pre-wrap;
  font-weight: bold;
`;

const Line = styled.div`
  display: flex;
`;

const Hex = styled.div`
  border-radius: 10px;
  background-color: white;
  align-content: center;
  padding: 3px;
  margin: 5px 15px 5px 5px;
  box-shadow: 2px 2px 2px grey;
  font-weight: normal;
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

interface ColorBoxProps {
  set: MirrorSet;
}

const ColorBox = ({ set }: ColorBoxProps) => {
  const hexSet = Object.values(set);
  return (
    <StyledColorBox>
      {poem.map((line, i) => (
        <Line>
          <Hex>{`#${hexSet[i]}:`}</Hex>
          <div key={i} style={{ color: `#${hexSet[i]}` }}>
            {`${line}`}
          </div>
        </Line>
      ))}
    </StyledColorBox>
  );
};

export default ColorBox;
