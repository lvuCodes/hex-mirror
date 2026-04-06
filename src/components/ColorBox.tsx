import styled from "styled-components";

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

const poem = [
  "For the moon never beams, without bringing me dreams",
  "    Of the beautiful Annabel Lee;",
  "And the stars never rise, but I feel the bright eyes",
  "    Of the beautiful Annabel Lee;",
  "And so, all the night-tide, I lie down by the side",
  "    Of my darling—my darling—my life and my bride,",
  "    In her sepulchre there by the sea—",
  "    In her tomb by the sounding sea.",
];

const ColorBox = (props) => {
  const { item } = this.props;
  return (
    <StyledColorBox>
      {poem.map((item) => (
        <div>{item}</div>
      ))}
    </StyledColorBox>
  );
};

export default ColorBox;
