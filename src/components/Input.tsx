import styled from "styled-components";
import cx from "classnames";
import { ChangeEvent, useState } from "react";
import { useColorList } from "../hooks";
import { isHexCode, hexStringToRGB, calculateHexAttr } from "../utils";

const StyledInput = styled.div`
  width: 90%;
  border-radius: 10px;
  margin: 20px auto 12px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 1.2rem;

  input {
    max-width: 80%;
    border: none;
    font-family: monospace;
    font-size: 24px;
    text-align: center;
    margin: auto;
    border-radius: 10px;
    box-shadow: 2px 2px 2px grey;
  }

  .error {
    border-bottom: 4px solid red;
    color: red;
    font-weight: bold;
  }
`;

const Input = () => {
  const { inputItem, updateItem } = useColorList();
  const [inputValue, setInputValue] = useState<string>(
    inputItem.hex.replace("#", "")
  );

  // Validity is a pure function of the current input, so derive it during render
  // rather than mirroring it into state via an effect.
  const isValid = isHexCode(inputValue);
  const inputClass = cx("input-field", { error: !isValid });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const stripped = event.target.value.replace("#", "");
    setInputValue(stripped);
    // Push only well-formed hex into the store; the change event is the right
    // place for the dispatch, so no post-render effect is needed.
    if (isHexCode(stripped)) {
      updateItem(0, calculateHexAttr(hexStringToRGB(stripped)));
    }
  };

  return (
    <StyledInput>
      <input
        className={inputClass}
        type="text"
        id="hex-input"
        name="hex-input"
        value={`#${inputValue.toUpperCase()}`}
        onChange={handleChange}
      />
    </StyledInput>
  );
};

export default Input;
