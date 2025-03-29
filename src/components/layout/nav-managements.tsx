"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavManagements({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
}) {
	const pathname = usePathname();
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Managements</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isActive =
						pathname === item.url ||
						pathname.split("/")[1] === item.url.split("/")[1];
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								asChild
								className={` ${
									isActive && pathname === item.url
										? "bg-secondary  text-secondary-foreground" // Active tab style
										: ""
								}`}
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
