// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import "./Input.css";
import cx from "classnames";
import { ChangeEvent, useState } from "react";
import { useColorList } from "../hooks";
import { isHexCode, hexStringToRGB, calculateHexAttr } from "../utils";

const Input = () => {
  const { inputItem, updateItem } = useColorList();
  const [inputValue, setInputValue] = useState<string>(inputItem.hex.replace("#", ""));

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
    <div className="input-box">
      <input
        className={inputClass}
        type="text"
        id="hex-input"
        name="hex-input"
        value={`#${inputValue.toUpperCase()}`}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
