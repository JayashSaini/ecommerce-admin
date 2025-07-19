"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../ui/mode-toggle";
import { Notifications } from "../common/notification";

import { ThemeSelector } from "./theme-selector";
import { SearchBar } from "../common/search-bar";

export function SiteHeader() {
	return (
		<header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height] py-2">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>

				<SearchBar />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>

				<div className="ml-auto flex items-center gap-2">
					<div className="sm:flex hidden">
						<ThemeSelector />
					</div>
					<div className="sm:flex hidden">
						<ModeToggle />
					</div>
					<Notifications />
				</div>
			</div>
		</header>
	);
}
