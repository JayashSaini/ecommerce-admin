import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LocalStorage } from "./lib/utils";

// Define public and protected routes
const publicRoutes = ["/", "/login"];
const dashboardRoutes = ["/dashboard", "/dashboard/**"]; // Add more as needed

export function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request;
	const token = cookies.get("accessToken")?.value || "";

	// Check user from Redux and localStorage
	let user;
	if (typeof window !== "undefined") {
		try {
			user = JSON.parse(LocalStorage.get("user") || "null");
		} catch (error) {
			console.log("error is : ", error);
			user = null;
		}
	}

	const isLoggedIn = !!user || !!token;
	const isPublicRoute = publicRoutes.some(
		(route) => nextUrl.pathname === route
	);
	const isDashboardRoute = dashboardRoutes.some((route) =>
		nextUrl.pathname.startsWith(route)
	);

	// If accessing a public route while logged in, redirect to dashboard
	if (isLoggedIn && isPublicRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// If accessing a dashboard route without login, redirect to login
	if (!isLoggedIn && isDashboardRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
	matcher: ["/", "/login", "/dashboard", "/dashboard/:path*"], // Include dashboard routes
};
