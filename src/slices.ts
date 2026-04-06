import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { getRandomHex, isHexCode } from "./utils";

export interface ColorCard {
  hex: string;
  isValid?: boolean;
  mirror?: string;
  red?: number;
  redComp?: number;
  R?: string;
  RComp?: string;
  green?: number;
  greenComp?: number;
  G?: string;
  GComp?: string;
  blue?: number;
  blueComp?: number;
  B?: string;
  BComp?: string;
  hue?: number;
  hueComp?: number;
  sat?: number;
  satComp?: number;
  lum?: number;
  lumComp?: number;
}

export interface ColorList {
  items: ColorCard[];
}

// export const initialState: ColorList = { items: [] };
// randomized input item
const {
  hex,
  red,
  redComp,
  R,
  RComp,
  green,
  G,
  greenComp,
  GComp,
  blue,
  blueComp,
  B,
  BComp,
  hue,
  hueComp,
  sat,
  satComp,
  lum,
  lumComp,
} = getRandomHex();
export const initialState: ColorList = {
  items: [
    {
      hex,
      red,
      redComp,
      R,
      RComp,
      green,
      greenComp,
      G,
      GComp,
      blue,
      blueComp,
      B,
      BComp,
      hue,
      hueComp,
      sat,
      satComp,
      lum,
      lumComp,
      isValid: isHexCode(hex),
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
