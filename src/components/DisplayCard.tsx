import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";

const StyledInputCard = styled.div`
  min-width: 20%;
  max-width: 80%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const InputCard = () => {
  return (
    <StyledInputCard>
      <Input />
      <ColorBox />
    </StyledInputCard>
  );
};

export default InputCard;
