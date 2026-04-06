import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";
import { useColorList } from "../hooks";
import { isHexCode } from "../utils";

const StyledInputCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const InputCard = () => {
  const { inputItem } = useColorList();
  const { hex } = inputItem;

  const bgColor = isHexCode(hex) ? hex : "FFFFFF";

  return (
    <StyledInputCard style={{ backgroundColor: `#${bgColor}` }}>
      <Input />
      <ColorBox item={inputItem} />
    </StyledInputCard>
  );
};

export default InputCard;
