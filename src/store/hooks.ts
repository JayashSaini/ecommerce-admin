// src/app/hooks.ts
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

// Use `AppDispatch` type for TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use `RootState` type for TypeScript support
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
