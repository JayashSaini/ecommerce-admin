"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../ui/mode-toggle";
import { Notifications } from "../common/notification";

// Import navigation data
import { data } from "@/components/layout/app-sidebar";

export function SiteHeader() {
	const pathname = usePathname();
	const [title, setTitle] = useState("Dashboard");

	// Function to find the title based on the current route
	const getTitle = () => {
		for (const section of Object.values(data)) {
			const match = section.find((item) => item.url === pathname);
			if (match) return match.title;
		}
		return "Dashboard"; // Default title
	};

	// Update title whenever the route changes
	useEffect(() => {
		setTitle(getTitle());
	}, [pathname]);

	return (
		<header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height] py-2">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{title}</h1>
				<div className="ml-auto flex items-center gap-2">
					<ModeToggle />
					<Notifications />
				</div>
			</div>
		</header>
	);
}
