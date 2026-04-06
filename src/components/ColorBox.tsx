import styled from "styled-components";

const StyledColorBox = styled.div`
  max-width: 90%;
  border-radius: 10px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 20px;
  text-align: center;
`;

const ColorBox = () => {
  return <StyledColorBox>Sphinx of black quartz, judge my vow.</StyledColorBox>;
};

export default ColorBox;
