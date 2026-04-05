import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// interface ColorState {
//   hexCode: string | null;
// }

// const initialState: ColorState = { hexCode: null };

// const colorSlice = createSlice({
//   name: "color",
//   initialState,
//   reducers: {
//     setHexCode: (state, action: PayloadAction<string>) => {
//       state.hexCode = action.payload;
//     },
//   },
// });

// export const { setHexCode } = colorSlice.actions;
// export default colorSlice.reducer;

// const selectColorState = ({ color }: RootState): ColorState => color;
// export const selectHexCode = createSelector(
//   selectColorState,
//   ({ hexCode }) => hexCode
// );
