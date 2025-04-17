"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	DrawerTitle,
} from "@/components/ui/drawer"; // <- make sure you have this
import { NotificationInterface } from "@/types/app";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function Notifications() {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const [allNotifications, setAllNotifications] = useState([
		{ message: "🛒 New order received! Check it out.", unread: true },
		{ message: "📦 Your package has been shipped!", unread: true },
		{ message: "🔔 You have a new message.", unread: true },
		{ message: "✅ Payment successfully received.", unread: false },
		{ message: "⚡ Server maintenance scheduled at midnight.", unread: false },
		{ message: "🔄 Your refund is processed.", unread: true },
		{ message: "🛠️ System update available.", unread: false },
		{ message: "📢 New announcement from admin.", unread: true },
		{ message: "🔑 Your password was changed.", unread: false },
		{ message: "🎉 Special discount for you!", unread: true },
	]);

	const [notifications, setNotifications] = useState<NotificationInterface[]>(
		[]
	);

	// Get unread notifications count
	const unreadCount = allNotifications.filter((n) => n.unread).length;
	const notificationCount = unreadCount > 9 ? "9+" : unreadCount;

	const removeNotification = (index: number) => {
		setNotifications((prev) => {
			const newNotifications = prev.filter((_, i) => i !== index);

			const remaining = allNotifications.filter(
				(n) => !newNotifications.includes(n)
			);
			if (newNotifications.length < 5 && remaining.length > 0) {
				newNotifications.push(remaining[0]);
			}

			if (newNotifications.length === 0) {
				setDrawerOpen(false);
			}

			return newNotifications;
		});
	};

	useEffect(() => {
		const sortedNotifications = [...allNotifications].sort((a, b) =>
			a.unread === b.unread ? 0 : a.unread ? -1 : 1
		);
		setNotifications(sortedNotifications.slice(0, 5));
		setAllNotifications(sortedNotifications);
	}, []);

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				className="relative"
				onClick={() => setDrawerOpen(true)}
			>
				<Bell className="h-5 w-5" />
				{unreadCount > 0 && (
					<span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full">
						{notificationCount}
					</span>
				)}
				<span className="sr-only">View notifications</span>
			</Button>

			<Drawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				direction="right"
			>
				<DrawerOverlay className="fixed inset-0 bg-background/30  z-40" />
				<DrawerContent className="w-full h-full max-w-md ml-auto mr-0 border-l">
					<DrawerHeader className="w-full   flex flex-row justify-between items-center  px-4 pt-4">
						<DrawerTitle className="text-lg">Notifications</DrawerTitle>

						{/* Tooltip and Delete All Button */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-500 hover:text-red-500"
									onClick={() =>
										console.log("delete notification clicked!!!!!!")
									} // Your delete all logic
								>
									<Trash2 className="w-5 h-5" />
									<span className="sr-only">Delete All Notifications</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Delete All Notifications</TooltipContent>
						</Tooltip>
					</DrawerHeader>

					<div className="px-4 py-2 space-y-2 overflow-y-auto max-h-[90vh]">
						{notifications.length > 0 ? (
							notifications.map((note, index) => (
								<div
									key={index}
									className="bg-card text-card-foreground rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-muted transition-all duration-200 "
								>
									{/* Left side: unread dot + icon + message */}
									<div className="flex items-start gap-3 flex-1">
										{/* Unread dot */}
										<span
											className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
												note.unread ? "bg-green-500" : "bg-transparent"
											}`}
										/>

										{/* Icon + Message */}
										<div className="flex flex-col space-y-0.5">
											{/* You can optionally parse emojis and use icons here */}
											<p className="text-sm font-medium text-muted-foreground truncate">
												{note.message}
											</p>
										</div>
									</div>

									{/* Close button */}
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-400 hover:text-red-500"
										onClick={() => removeNotification(index)}
									>
										<X className="w-4 h-4" />
										<span className="sr-only">Dismiss notification</span>
									</Button>
								</div>
							))
						) : (
							<p className="text-center text-sm text-gray-500">
								No notifications
							</p>
						)}
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
