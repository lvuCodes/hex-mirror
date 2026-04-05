import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";

const StyledDisplayCard = styled.div`
  min-width: 20%;
  max-width: 80%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const DisplayCard = () => {
  return (
    <StyledDisplayCard>
      <Input />
      <ColorBox />
    </StyledDisplayCard>
  );
};

export default DisplayCard;
