import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";
import { useColorList } from "../hooks";

const StyledInputCard = styled.div`
  min-width: 20%;
  max-width: 80%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const InputCard = () => {
  const { inputItem, updateItem } = useColorList();
  const { hex, isValid } = inputItem;

  const bgColor = isValid ? hex : "FFFFFF";

  return (
    <StyledInputCard style={{ backgroundColor: `#${bgColor}` }}>
      <Input />
      <ColorBox />
    </StyledInputCard>
  );
};

export default InputCard;
