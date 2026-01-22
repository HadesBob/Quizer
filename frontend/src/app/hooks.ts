import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 1. useAppDispatch - wie o asynchronicznych akcjach (Thunks)
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 2. useAppSelector - zna całą strukturę bazy danych w Twoim Store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;