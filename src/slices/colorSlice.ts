import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { calculateHexAttr, getRandomHex, ColorCard } from "../utils";

export interface ColorList {
  items: ColorCard[];
}

// Seed the input card with a random color.
const {
  RGB: { red, green, blue },
} = getRandomHex();
export const initialState: ColorList = {
  items: [calculateHexAttr({ red, green, blue })],
};

const colorListSlice = createSlice({
  name: "colorList",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ColorCard>) => {
      state.items.push(action.payload);
    },
    updateItem: (
      state,
      action: PayloadAction<{ index: number; item: ColorCard }>
    ) => {
      state.items[action.payload.index] = action.payload.item;
    },
  },
});

export const { addItem, updateItem } = colorListSlice.actions;
export default colorListSlice.reducer;

const selectColorList = ({ colorList }: RootState): ColorList => colorList;

export const selectItems = createSelector(
  selectColorList,
  ({ items }) => items
);
