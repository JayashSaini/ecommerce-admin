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
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "d3ef7beuhkdr29.cloudfront.net",
			},
		],
	},
};

export default nextConfig;
