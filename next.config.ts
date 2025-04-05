// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/auth/:path*",
				destination: "http://localhost:8000/api/:path*", // Auth server
			},
			{
				source: "/ecom/:path*",
				destination: "http://localhost:5000/api/:path*", // Ecommerce server
			},
		];
	},
};

export default nextConfig;
