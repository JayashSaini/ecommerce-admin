"use client";
import { Toaster as Toast } from "sonner";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export function Toaster({ children }: { children: ReactNode }) {
	const { theme } = useTheme();

	return (
		<>
			<Toast
				position="top-right"
				theme={
					theme === "light" ? "light" : theme === "dark" ? "dark" : "system"
				}
				duration={2500}
				richColors
			/>
			{children}
		</>
	);
}
