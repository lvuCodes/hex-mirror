import { useDispatch } from "react-redux";
import { useAppSelector } from "./use-app-selector";
import { AppDispatch } from "./store";
import { selectHexCode, setHexCode } from "./slices";

export function useColor() {
  const dispatch = useDispatch<AppDispatch>();
  const hexCode = useAppSelector(selectHexCode);

  return {
    hexCode,
    setHexCode: (value: string) => dispatch(setHexCode(value)),
  };
}
