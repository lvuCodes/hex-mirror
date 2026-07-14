import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";

import colorListReducer, {
  initialState as colorListInitialState,
} from "./slices/colorSlice";

const store = configureStore({
  reducer: {
    colorList: colorListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, null, AnyAction>;

export const RootInitialState: RootState = {
  colorList: colorListInitialState,
};

export default store;
