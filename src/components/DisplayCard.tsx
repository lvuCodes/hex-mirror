import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";

const Display = styled.div`
  display: flex;
  gap: 8px;
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
