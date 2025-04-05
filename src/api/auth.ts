// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "@/lib/utils";

// Create an Axios instance for API requests
const authClient = axios.create({
	baseURL: "/auth/v1",
	withCredentials: true,
	timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
// Add a request interceptor to set the authorization header with user token
authClient.interceptors.request.use(
	function (config) {
		// Retrieve user token from local storage
		const token = LocalStorage.get("token");
		// Set authorization header with bearer token
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// API functions for User actions
const loginUser = (data: { email: string; password: string }) => {
	return authClient.post("/user/login?isAdminPanel=true", data);
};

const logoutUser = () => {
	return authClient.post("/user/logout");
};

export {
	authClient,
	loginUser,
	logoutUser,
	// Add other API functions as needed for other endpoints
};
