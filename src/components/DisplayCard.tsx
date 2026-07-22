// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import "./DisplayCard.css";
import Input from "./Input";
import ColorBox from "./ColorBox";
import { useColorList } from "../hooks";
import { isHexCode } from "../utils";

const InputCard = () => {
  const { inputItem } = useColorList();
  const { hex, mirrorSet } = inputItem;

  const bgColor = isHexCode(hex) ? hex : "FFFFFF";
  const borderColor = mirrorSet.mirror_midpoint || "000000";

  return (
    <div
      className="display-card"
      style={{ backgroundColor: `#${bgColor}`, borderColor: `#${borderColor}` }}
    >
      <Input />
      <ColorBox set={mirrorSet} />
    </div>
  );
};

export default InputCard;
