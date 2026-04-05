// import { createSelector } from "@reduxjs/toolkit";
// import type { RootState } from "../store";

// // ------------------------------------------------------------
// // 1. Slice state type
// // ------------------------------------------------------------
// export interface TemplateState {
//   exampleValue: string | null;
//   exampleList: ExampleItem[];
//   isLoading: boolean;
// }

// export interface ExampleItem {
//   id: string;
//   label: string;
// }

// export const templateInitialState: TemplateState = {
//   exampleValue: null,
//   exampleList: [],
//   isLoading: false,
// };

// // ------------------------------------------------------------
// // 2. Root selector
// //    Always private — consume via derived selectors below.
// //    Key must match the reducer key registered in store.ts.
// // ------------------------------------------------------------
// const selectTemplateState = ({ template }: RootState): TemplateState =>
//   template;

// // ------------------------------------------------------------
// // 3. Simple field selectors
// // ------------------------------------------------------------
// export const selectExampleValue = createSelector(
//   selectTemplateState,
//   ({ exampleValue }) => exampleValue
// );

// export const selectIsLoading = createSelector(
//   selectTemplateState,
//   ({ isLoading }) => isLoading
// );

// export const selectExampleList = createSelector(
//   selectTemplateState,
//   ({ exampleList }) => exampleList
// );

// // ------------------------------------------------------------
// // 4. Derived / computed selector
// //    Combines multiple inputs; recomputes only when inputs change.
// // ------------------------------------------------------------
// export const selectHasItems = createSelector(
//   selectExampleList,
//   (list) => list.length > 0
// );

// export const selectExampleCount = createSelector(
//   selectExampleList,
//   (list) => list.length
// );

// // ------------------------------------------------------------
// // 5. Cross-slice selector
// //    Import selectors from other slices as additional inputs.
// // ------------------------------------------------------------
// // import { selectSomeOtherValue } from './other-slice';
// //
// // export const selectCombinedValue = createSelector(
// //     selectExampleValue,
// //     selectSomeOtherValue,
// //     (exampleValue, otherValue) => exampleValue && otherValue,
// // );

// // ------------------------------------------------------------
// // 6. Parameterized selector (factory pattern)
// //    Returns a new memoized selector per argument.
// //    NOTE: each call to the factory creates a new selector instance —
// //    do not call inline in render; assign to a variable or useMemo.
// // ------------------------------------------------------------
// export const selectItemById = (id: string) =>
//   createSelector(
//     selectExampleList,
//     (list) => list.find((item) => item.id === id) ?? null
//   );
