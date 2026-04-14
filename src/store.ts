import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";

import colorListReducer, {
  initialState as colorListInitialState,
} from "./slices/colorSlice";
import compareListReducer, {
  initialState as compareListInitialState,
} from "./slices/compareSlice";

const store = configureStore({
  reducer: {
    colorList: colorListReducer,
    compareList: compareListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, null, AnyAction>;

export const RootInitialState: RootState = {
  colorList: colorListInitialState,
  compareList: compareListInitialState,
};

export default store;
