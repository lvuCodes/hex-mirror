import styled from "styled-components";
import ColorBox from "./ColorBox";

const StyledDisplayCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const DisplayCard = () => {
  return (
    <StyledDisplayCard>
      <ColorBox />
    </StyledDisplayCard>
  );
};

export default DisplayCard;
