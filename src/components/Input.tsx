import styled from "styled-components";
import Classnames from "classnames";
import { useColorList } from "../hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { isHexCode } from "../utils";

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

  .error {
    border-bottom: 4px solid red;
    color: red;
    font-weight: bold;
  }
`;

const Input = () => {
  const { inputItem } = useColorList();

  const [inputValue, setInputValue] = useState<string>(inputItem.hex);
  const [isValid, setIsValid] = useState<boolean>(isHexCode(inputItem.hex));

  const inputClass = Classnames("input-field", {
    error: !isValid,
  });

  useEffect(() => {
    setIsValid(isHexCode(inputValue));
  }, [inputValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <StyledInput>
      <input
        className={inputClass}
        type="text"
        id="hex-input"
        name="hex-input"
        placeholder={`#${inputValue}`}
        onChange={(e) => handleChange(e)}
      />
    </StyledInput>
  );
};

export default Input;
