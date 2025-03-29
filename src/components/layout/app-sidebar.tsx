"use client";

import * as React from "react";
import {
	IconPackage,
	IconDashboard,
	IconInnerShadowTop,
	IconShirt,
	IconSettings,
	IconUsers,
	IconCurrencyDollar,
	IconChartBar,
	IconTruck,
	IconHeadset,
	IconMessageCircle,
	IconGift,
	IconAdCircle,
} from "@tabler/icons-react";

import { NavManagements } from "@/components/layout/nav-managements";
import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";

export const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Products",
			url: "/dashboard/products",
			icon: IconShirt,
		},

		{
			title: "Orders",
			url: "/dashboard/orders",
			icon: IconPackage,
		},
		{
			title: "Customers",
			url: "/dashboard/customers",
			icon: IconUsers,
		},
		{
			title: "Payments & Transactions",
			url: "/dashboard/payments",
			icon: IconCurrencyDollar,
		},
	],

	navManagement: [
		{
			title: "Analytics",
			url: "/dashboard/analytics",
			icon: IconChartBar,
		},
		{
			title: "Marketing & Discounts",
			url: "/dashboard/marketing",
			icon: IconAdCircle,
		},
		{
			title: "Shipping & Logistics",
			url: "/dashboard/shipping",
			icon: IconTruck,
		},
		{
			title: "Customer Support",
			url: "/dashboard/support",
			icon: IconHeadset,
		},
		{
			title: "Reviews & Feedback",
			url: "/dashboard/reviews",
			icon: IconMessageCircle,
		},
	],

	navSecondary: [
		{
			title: "Loyalty & Rewards",
			url: "/dashboard/rewards",
			icon: IconGift,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: IconSettings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAppSelector((state) => state.auth);
	return (
		<Sidebar
			collapsible="offcanvas"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a
								href="http://localhost:3000"
								target="_blank"
							>
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">SLYIX APPAREL</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavManagements items={data.navManagement} />
				<NavSecondary
					items={data.navSecondary}
					className="mt-auto"
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: user?.username || "John",
						email: user?.email || "john@gmail.com",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
