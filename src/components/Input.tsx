import styled from "styled-components";

const StyledInput = styled.div`
  width: 90%;
  border-radius: 10px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 24px;

  input {
    max-width: 80%;
    border: none;
    border-bottom: 2px solid black;
    font-family: monospace;
    font-size: 24px;
    text-align: center;
    margin: auto;
  }
`;

const Input = () => {
  return (
    <StyledInput>
      <input type="text" id="hex-input" name="hex-input" placeholder="000000" />
    </StyledInput>
  );
};

export default Input;
