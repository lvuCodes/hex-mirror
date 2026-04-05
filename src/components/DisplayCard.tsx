import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";

const Display = styled.div`
  width: 20%;
  border: 2px solid grey;
`;

const DisplayCard = () => {
  return (
    <div className="display-card">
      <Input />
      <ColorBox />
    </div>
  );
};

export default DisplayCard;
