"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";

import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { LocalStorage } from "@/lib/utils";
import { setUser } from "@/features/slices/authSlice";
import { UserInterface } from "@/types/auth";
import { getCategories, getProducts } from "@/features/thunk/dashboardThunk";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!user) {
			const user: UserInterface | null = LocalStorage.get("user");
			if (user) {
				dispatch(setUser({ user }));
			}
		}
		if (user) {
			dispatch(getCategories());
			dispatch(getProducts());
		}
	}, [user, dispatch]);

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						{children}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
