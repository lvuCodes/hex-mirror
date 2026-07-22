// Hex Mirror. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { calculateHexAttr, getRandomHex, ColorCard } from "../utils";

export interface ColorList {
  items: ColorCard[];
}

export const initialState: ColorList = {
  items: [calculateHexAttr({ red: 0, green: 0, blue: 0 })],
};

const colorListSlice = createSlice({
  name: "colorList",
  initialState,
  reducers: {
    updateItem: (state, action: PayloadAction<{ index: number; item: ColorCard }>) => {
      state.items[action.payload.index] = action.payload.item;
    },
  },
});

export const { updateItem } = colorListSlice.actions;
export default colorListSlice.reducer;

export const seedRandomColor = () =>
  updateItem({ index: 0, item: calculateHexAttr(getRandomHex().RGB) });

const selectColorList = ({ colorList }: RootState): ColorList => colorList;

export const selectItems = createSelector(selectColorList, ({ items }) => items);
