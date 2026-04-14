import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CompareItem, populateState } from "../utils";

const sampleState: CompareItem[] = [
  { hexA: { hex: "3e0f3d" }, hexB: { hex: "f0c1ef" } },
  { hexA: { hex: "2e437d" }, hexB: { hex: "839bd4" } },
  { hexA: { hex: "191066" }, hexB: { hex: "a399f1" } },
  { hexA: { hex: "714008" }, hexB: { hex: "f5c18b" } },
  { hexA: { hex: "398d4b" }, hexB: { hex: "70c683" } },
  { hexA: { hex: "a22f91" }, hexB: { hex: "d05dbf" } },
  { hexA: { hex: "0d391d" }, hexB: { hex: "c4f2d2" } },
  { hexA: { hex: "300100" }, hexB: { hex: "fdcecd" } },
  { hexA: { hex: "0d7285" }, hexB: { hex: "7ae1f4" } },
  { hexA: { hex: "073266" }, hexB: { hex: "97bef5" } },
  { hexA: { hex: "493906" }, hexB: { hex: "f7e9b6" } },
  { hexA: { hex: "ba4545" }, hexB: { hex: "ba4545" } },
  { hexA: { hex: "b86292" }, hexB: { hex: "9e4779" } },
  { hexA: { hex: "2a4b80" }, hexB: { hex: "7e9dd4" } },
  { hexA: { hex: "688216" }, hexB: { hex: "cce67d" } },
  { hexA: { hex: "7c711e" }, hexB: { hex: "e0d582" } },
  { hexA: { hex: "732f11" }, hexB: { hex: "eca78b" } },
  { hexA: { hex: "3b999d" }, hexB: { hex: "61c0c4" } },
  { hexA: { hex: "9d0207" }, hexB: { hex: "ff6067" } },
  { hexA: { hex: "572a01" }, hexB: { hex: "ffd2a8" } },
  { hexA: { hex: "633c65" }, hexB: { hex: "c098c4" } },
  { hexA: { hex: "750f3e" }, hexB: { hex: "ef8ab9" } },
  { hexA: { hex: "3b695a" }, hexB: { hex: "96c6b6" } },
  { hexA: { hex: "6a0010" }, hexB: { hex: "ff96a5" } },
];

export const initialState = populateState(sampleState);

const compareListSlice = createSlice({
  name: "compareList",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CompareItem>) => {
      state.push(action.payload);
    },
    updateItem: (
      state,
      action: PayloadAction<{ index: number; item: CompareItem }>
    ) => {
      state[action.payload.index] = action.payload.item;
    },
  },
});

export const { addItem, updateItem } = compareListSlice.actions;
export default compareListSlice.reducer;

export const selectList = createSelector(
  ({ compareList }: RootState) => compareList,
  (items) => items
);
