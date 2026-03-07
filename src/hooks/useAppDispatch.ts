import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

// 封装带AppDispatch类型的useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
