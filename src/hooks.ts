// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AsyncThunk } from "@reduxjs/toolkit";

// import { AppDispatch } from "../store";
// import { useAppSelector } from "./use-app-selector";

// // Import selectors and actions from the relevant slice
// // import { selectExampleValue, selectIsLoading } from '../slices/template-slice';
// // import { someAction, someAsyncThunk } from '../slices/template-slice';

// // ------------------------------------------------------------
// // 1. Selector-only hook
// //    Read state; no dispatch.
// // ------------------------------------------------------------
// export function useTemplateData(): {
//   exampleValue: string | null;
//   isLoading: boolean;
// } {
//   const exampleValue = useAppSelector((state) => state.template.exampleValue);
//   const isLoading = useAppSelector((state) => state.template.isLoading);
//   // Prefer imported createSelector selectors over inline lambdas:
//   // const exampleValue = useAppSelector(selectExampleValue);

//   return {
//     exampleValue,
//     isLoading,
//   };
// }

// // ------------------------------------------------------------
// // 2. Dispatch hook
// //    Write state; wraps one or more actions.
// // ------------------------------------------------------------
// export function useTemplateActions(): {
//   handleSomeAction: (value: string) => void;
// } {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSomeAction = (value: string): void => {
//     // dispatch(someAction(value));
//   };

//   return {
//     handleSomeAction,
//   };
// }

// // ------------------------------------------------------------
// // 3. Combined read/write hook
// //    Selector + dispatch in one hook when tightly coupled.
// // ------------------------------------------------------------
// export function useTemplate(): {
//   exampleValue: string | null;
//   isLoading: boolean;
//   handleSomeAction: (value: string) => void;
// } {
//   const dispatch = useDispatch<AppDispatch>();
//   const exampleValue = useAppSelector((state) => state.template.exampleValue);
//   const isLoading = useAppSelector((state) => state.template.isLoading);

//   const handleSomeAction = (value: string): void => {
//     // dispatch(someAction(value));
//   };

//   return {
//     exampleValue,
//     isLoading,
//     handleSomeAction,
//   };
// }

// // ------------------------------------------------------------
// // 4. Async loader hook
// //    Mirrors useAsyncLoader pattern in use-async-loader.ts.
// //    Dispatches a thunk on mount; handles retry and cleanup.
// // ------------------------------------------------------------
// export function useTemplateLoader(): void {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     const promise = dispatch(/* someAsyncThunk() */ null);

//     return () => {
//       promise?.abort?.();
//     };
//   }, [dispatch]);
// }

// // ------------------------------------------------------------
// // 5. Router hook
// //    Mirrors useGoToRoute pattern in use-goto-route.ts.
// // ------------------------------------------------------------
// // import { routes } from '../utils/helpers/routing-helpers';
// //
// // export function useTemplateNavigation(): {
// //     goToTemplate: () => void;
// // } {
// //     const navigate = useNavigate();
// //
// //     const goToTemplate = (): void => {
// //         navigate(routes.TEMPLATE_ROUTE);
// //     };
// //
// //     return { goToTemplate };
// // }
