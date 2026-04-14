import styled from "styled-components";

const StyledCompareCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const CompareCard = () => {
  return <StyledCompareCard></StyledCompareCard>;
};

export default CompareCard;
