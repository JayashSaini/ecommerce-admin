import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ActiveThemeProvider } from "@/components/layout/active-theme";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "@/features/provider";
import { Toaster } from "@/components/ui/toaster";

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
						<Toaster>
							<ReduxProvider>{children}</ReduxProvider>
						</Toaster>
					</ActiveThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
