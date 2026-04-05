import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

import colorReducer, { initialState as colorInitialState } from "./slices";

const store = configureStore({
  reducer: {
    color: colorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, null, AnyAction>;

export const RootInitialState: RootState = {
  color: colorInitialState,
};

export default store;
