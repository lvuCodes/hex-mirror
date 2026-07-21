// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import styled from "styled-components";
import Input from "./Input";
import ColorBox from "./ColorBox";
import { useColorList } from "../hooks";
import { isHexCode } from "../utils";

const StyledInputCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 4px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const InputCard = () => {
  const { inputItem } = useColorList();
  const { hex, mirrorSet } = inputItem;

  const bgColor = isHexCode(hex) ? hex : "FFFFFF";
  const borderColor = mirrorSet.mirror_midpoint || "000000";

  return (
    <StyledInputCard
      style={{ backgroundColor: `#${bgColor}`, borderColor: `#${borderColor}` }}
    >
      <Input />
      <ColorBox set={mirrorSet} />
    </StyledInputCard>
  );
};

export default InputCard;
