// import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
// import { AnyAction } from 'redux';

// // ------------------------------------------------------------
// // Import reducers and initial states from slices
// // Pattern: import [feature]Reducer, { [feature]InitialState } from './slices/[feature]-slice';
// // ------------------------------------------------------------
// import templateReducer, { templateInitialState } from './slices/template-slice';

// // ------------------------------------------------------------
// // Store
// // ------------------------------------------------------------
// const store = configureStore({
//     reducer: {
//         template: templateReducer,
//         // Add additional reducers here, one per slice
//     },
// });

// // ------------------------------------------------------------
// // Type exports
// // Inferred from store — do not hand-write these.
// // ------------------------------------------------------------
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, null, AnyAction>;

// // ------------------------------------------------------------
// // RootInitialState
// // Used in test-utils to seed the store with known state.
// // Must mirror the reducer map above 1:1.
// // ------------------------------------------------------------
// export const RootInitialState: RootState = {
//     template: templateInitialState,
// };

// export default store;
