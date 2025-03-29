/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "@/api";
import { LocalStorage } from "@/lib/utils";

// Create async thunks for handling API calls
export const login = createAsyncThunk(
	"auth/login",
	async (
		data: { email: string; password: string },
		{ rejectWithValue }: { rejectWithValue: any }
	) => {
		try {
			const response = await loginUser(data);
			const userData = response.data.data;
			LocalStorage.set("user", userData.user);
			LocalStorage.set("token", userData.accessToken);
			return { user: userData.user, accessToken: userData.accessToken };
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to login"
			);
		}
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await logoutUser();
			LocalStorage.clear();
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to logout"
			);
		}
	}
);
