// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/slices/authSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer, // import your auth reducer here
	},
});

// Type for the entire state of the Redux store
export type RootState = ReturnType<typeof store.getState>;

// Type for the dispatch function
export type AppDispatch = typeof store.dispatch;
