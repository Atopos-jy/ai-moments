import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../store";

// 封装带RootState类型的useSelector，避免组件重复定义类型
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
