// features/slices/dashboardSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getCategories, getProducts } from "../thunk/dashboardThunk";
import { DashboardState } from "@/types/app";

const initialState: DashboardState = {
	categories: [],
	paginatedProducts: {
		limit: 10,
		page: 0,
		products: [],
		totalPages: 0,
		totalProducts: 0,
		filters: [],
	},
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setProducts: (state, action) => {
			state.paginatedProducts.products = action.payload;
		},
		setLimit: (state, action) => {
			state.paginatedProducts.limit = action.payload;
		},
		setPage: (state, action) => {
			state.paginatedProducts.page = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getCategories.fulfilled, (state, action) => {
			state.categories = action.payload;
		});
		builder.addCase(getProducts.fulfilled, (state, action) => {
			state.paginatedProducts = {
				products: action.payload.products,
				totalPages: action.payload.totalPages,
				totalProducts: action.payload.totalProducts,
				filters: [],
				limit: action.payload.limit,
				page: action.payload.page - 1,
			};
		});
	},
});

export default dashboardSlice.reducer;
export const { setProducts, setLimit, setPage } = dashboardSlice.actions;
