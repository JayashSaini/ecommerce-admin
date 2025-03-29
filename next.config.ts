import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*", // the path on your Next.js app
				destination: "http://localhost:8000/api/:path*", // the target backend URL
			},
		];
	},
};

export default nextConfig;
