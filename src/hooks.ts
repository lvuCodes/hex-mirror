import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { AppDispatch } from "./store";
// import { selectHexCode, setHexCode } from "./slices";

// export function useColor() {
//   const dispatch = useDispatch<AppDispatch>();
//   const hexCode = useSelector((state: RootState) => state.color.hexCode);

//   return {
//     hexCode,
//     setHexCode: (value: string) => dispatch(setHexCode(value)),
//   };
// }
