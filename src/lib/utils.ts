/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/api";
import { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// A utility function for handling API requests with loading, success, and error handling
export const requestHandler = async (
	api: () => Promise<AxiosResponse<ApiResponse>>,
	setLoading: ((loading: boolean) => void) | null,
	onSuccess: (data: ApiResponse) => void,
	onError: (error: string) => void
) => {
	// Show loading state if setLoading function is provided

	if (setLoading) {
		setLoading(true);
	}

	try {
		// Make the API request
		const response = await api();
		const { data } = response;

		if (data?.success) {
			// Call the onSuccess callback with the response data
			onSuccess(data);
		}
	} catch (error: any) {
		if (error.response?.status === 422) {
			const errorMessage = error.response.data.errors[0].message;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars

			onError(errorMessage as string);
		} else if (401 == error?.response.status || error?.response.status == 403) {
			LocalStorage.clear();
			if (isBrowser) window.location.href = "/login"; // Redirect to login page
		} else {
			onError(error.response?.data?.message || "Something went wrong");
		}
	} finally {
		// Hide loading state if setLoading function is provided
		if (setLoading) setLoading(false);
	}
};

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";

// A class that provides utility functions for working with local storage
export class LocalStorage {
	// Get a value from local storage by key
	static get<T>(key: string): T | null {
		if (!isBrowser) return null;

		const value = localStorage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value) as T;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				return null;
			}
		}

		return null;
	}

	// Set a value in local storage by key
	static set(key: string, value: string) {
		if (!isBrowser) return;
		localStorage.setItem(key, JSON.stringify(value));
	}

	// Remove a value from local storage by key
	static remove(key: string) {
		if (!isBrowser) return;
		localStorage.removeItem(key);
	}

	// Clear all items from local storage
	static clear() {
		if (!isBrowser) return;
		localStorage.clear();
	}
}
