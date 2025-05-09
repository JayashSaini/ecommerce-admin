"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	// Toggle between light and dark themes
	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
		>
			{/* Sun icon for light mode, Moon icon for dark mode */}
			<Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
			<Moon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
