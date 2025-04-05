/* eslint-disable @typescript-eslint/no-explicit-any */
// features/thunk/dashboardThunk.ts
import { getCategoriesAPI, getProductsAPI } from "@/api/ecommerce";
import { RootState } from "@/store";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCategories = createAsyncThunk(
	"dashboard/getCategory",
	async (_, thunkAPI) => {
		try {
			const { data } = await getCategoriesAPI(); // Adjust the URL
			return data.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const getProducts = createAsyncThunk(
	"dashboard/getProducts",
	async (_, thunkAPI) => {
		try {
			// ✅ Access pagination state
			const state = thunkAPI.getState() as RootState;
			const { page, limit } = state.dashboard.paginatedProducts;

			const { data } = await getProductsAPI({
				page,
				limit,
			});

			return data.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);
