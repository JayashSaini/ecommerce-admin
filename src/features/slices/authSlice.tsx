// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserInterface } from "@/types/auth";
import { toast } from "sonner";

import { login, logout } from "@/features/thunk/authThunk";
import { LocalStorage } from "@/lib/utils";

const initialState: AuthState = {
	user: null,
	email: null,
};

// Create slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearState(state) {
			state.user = null;
			state.email = null;
		},
		setUser(state, action: PayloadAction<{ user: UserInterface }>) {
			state.user = action.payload.user;
			state.email = action.payload.user.email || null;
		},
		updateAvatar(state, action: PayloadAction<{ user: UserInterface }>) {
			console.log("slice ", action.payload.user);
			state.user = action.payload.user;
			LocalStorage.set("user", JSON.stringify(state.user));
		},
	},
	extraReducers: (builder) => {
		builder

			.addCase(
				login.fulfilled,
				(
					state,
					action: PayloadAction<{ user: UserInterface; accessToken: string }>
				) => {
					state.user = action.payload.user;

					toast.success("Login successful!");
				}
			)
			.addCase(login.rejected, (state, action) => {
				toast.error(action.payload as string);
			})

			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.email = null;

				window.location.href = "/login";
				toast.success("Logout successful!");
			});
	},
});

export const { clearState, setUser, updateAvatar } = authSlice.actions;
export default authSlice.reducer;
