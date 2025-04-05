// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/slices/authSlice";
import dashboardReducer from "@/features/slices/dashboardSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer, // import your auth reducer here
		dashboard: dashboardReducer, // import your dashboard
	},
});

// Type for the entire state of the Redux store
export type RootState = ReturnType<typeof store.getState>;

// Type for the dispatch function
export type AppDispatch = typeof store.dispatch;
