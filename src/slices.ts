import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { getRandomHex } from "./utils";

export interface ColorCard {
  hex: string;
  isValid?: boolean;
  mirror?: string;
}

export interface ColorList {
  items: ColorCard[];
}

// export const initialState: ColorList = { items: [] };
// randomized input item
export const initialState: ColorList = {
  items: [
    {
      hex: getRandomHex(),
    },
  ],
};

const colorListSlice = createSlice({
  name: "colorList",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ColorCard>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addItem } = colorListSlice.actions;
export default colorListSlice.reducer;

const selectColorList = ({ colorList }: RootState): ColorList => colorList;

export const selectItems = createSelector(
  selectColorList,
  ({ items }) => items
);
