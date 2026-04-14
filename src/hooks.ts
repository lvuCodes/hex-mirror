import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./store";
import type { ColorCard } from "./utils";
import { addItem, updateItem, selectItems } from "./slices/colorSlice";
import { selectList } from "./slices/compareSlice";

export function useColorList() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectItems);

  return {
    items,
    inputItem: items[0],
    addItem: (item: ColorCard) => dispatch(addItem(item)),
    updateItem: (index: number, item: ColorCard) =>
      dispatch(updateItem({ index, item })),
  };
}

export function useCompareList() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectList);

  return {
    items,
  };
}
