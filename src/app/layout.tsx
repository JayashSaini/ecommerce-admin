import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SLYIX APPAREL - ADMIN PANEL",
	description: "SLYIX APPAREL - ADMIN PANEL",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const activeThemeValue = cookieStore.get("active_theme")?.value;
	const isScaled = activeThemeValue?.endsWith("-scaled");
	return (
		<html
			lang="en"
			className={cn(
				"bg-background overscroll-none font-sans antialiased",
				activeThemeValue ? `theme-${activeThemeValue}` : "",
				isScaled ? "theme-scaled" : ""
			)}
			suppressHydrationWarning
		>
			<body className={`${inter.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					enableColorScheme
				>
					<ActiveThemeProvider initialTheme={activeThemeValue}>
						{children}
					</ActiveThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
