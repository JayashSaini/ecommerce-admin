"use client";

import { useThemeConfig } from "@/components/layout/active-theme";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const DEFAULT_THEMES = [
	{ name: "Crystal Dawn", value: "default" },
	{ name: "Ocean Pulse", value: "blue" },
	{ name: "Emerald Blaze", value: "green" },
	{ name: "Golden Ember", value: "amber" },
	{ name: "Velvet Eclipse", value: "violet" },
	{ name: "Midnight Glacier", value: "midnight" },
];

const SCALED_THEMES = [
	{ name: "Crystal Dawn Scaled", value: "default-scaled" },
	{ name: "Ocean Pulse Scaled", value: "blue-scaled" },
];

const MONO_THEMES = [{ name: "Noir Mode", value: "mono-scaled" }];

export function ThemeSelector() {
	const { activeTheme, setActiveTheme } = useThemeConfig();

	return (
		<div className="flex items-center gap-2">
			<Label
				htmlFor="theme-selector"
				className="sr-only"
			>
				Theme
			</Label>
			<Select
				value={activeTheme}
				onValueChange={setActiveTheme}
			>
				<SelectTrigger
					id="theme-selector"
					size="sm"
					className="justify-start *:data-[slot=select-value]:w-12"
				>
					<span className="text-muted-foreground hidden sm:block">
						Choose Style
					</span>
					<span className="text-muted-foreground block sm:hidden">Theme</span>
					<SelectValue placeholder="Select a theme" />
				</SelectTrigger>
				<SelectContent align="end">
					<SelectGroup>
						<SelectLabel>Default</SelectLabel>
						{DEFAULT_THEMES.map((theme) => (
							<SelectItem
								key={theme.name}
								value={theme.value}
							>
								{theme.name}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Scaled</SelectLabel>
						{SCALED_THEMES.map((theme) => (
							<SelectItem
								key={theme.name}
								value={theme.value}
							>
								{theme.name}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Monospaced</SelectLabel>
						{MONO_THEMES.map((theme) => (
							<SelectItem
								key={theme.name}
								value={theme.value}
							>
								{theme.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
