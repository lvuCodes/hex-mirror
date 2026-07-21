// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./store";
import type { ColorCard } from "./utils";
import { updateItem, selectItems } from "./slices/colorSlice";

export function useColorList() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectItems);

  return {
    items,
    inputItem: items[0],
    updateItem: (index: number, item: ColorCard) =>
      dispatch(updateItem({ index, item })),
  };
}
