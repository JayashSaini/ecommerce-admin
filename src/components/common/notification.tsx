"use client";

import { useEffect, useState } from "react";
import { Bell, X, ArrowRight } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotificationInterface } from "@/types/app";

export function Notifications() {
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
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Get unread notifications count
	const unreadCount = allNotifications.filter((n) => n.unread).length;
	const notificationCount = unreadCount > 9 ? "9+" : unreadCount;

	// Function to remove a notification
	const removeNotification = (index: number) => {
		setNotifications((prev) => {
			const newNotifications = prev.filter((_, i) => i !== index); // Remove clicked notification

			// Auto-load next notification from the list if available
			const remaining = allNotifications.filter(
				(n) => !newNotifications.includes(n)
			);
			if (newNotifications.length < 5 && remaining.length > 0) {
				newNotifications.push(remaining[0]);
			}

			// Close dropdown if no notifications left
			if (newNotifications.length === 0) {
				setDropdownOpen(false);
			}

			return newNotifications;
		});
	};

	// Load initial notifications
	useEffect(() => {
		const sortedNotifications = [...allNotifications].sort((a, b) =>
			a.unread === b.unread ? 0 : a.unread ? -1 : 1
		);
		setNotifications(sortedNotifications.slice(0, 5)); // Load first 5 notifications
		setAllNotifications(sortedNotifications);
	}, []);

	return (
		<DropdownMenu
			open={dropdownOpen}
			onOpenChange={setDropdownOpen}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="relative"
					onClick={() => setDropdownOpen(true)}
				>
					<Bell className="h-5 w-5" />
					{/* Notification Badge */}
					{unreadCount > 0 && dropdownOpen === false && (
						<span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full">
							{notificationCount}
						</span>
					)}
					<span className="sr-only">View notifications</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="sm:w-96 w-72 mt-2 shadow-lg p-2"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-2 py-1 text-card-foreground">
					<span className="text-sm font-semibold ">Notifications</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
							>
								<ArrowRight className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>See all</TooltipContent>
					</Tooltip>
				</div>
				<DropdownMenuSeparator />

				{/* Notification List */}
				{notifications.length > 0 ? (
					notifications.map((note, index) => (
						<DropdownMenuItem
							key={index}
							className="flex items-center gap-2 py-2 justify-between"
						>
							<div className="flex items-center gap-2 truncate flex-1">
								<span
									className={`h-2 w-2 rounded-full ${
										note.unread ? "bg-green-500" : "bg-transparent"
									}`}
								/>
								<span className="truncate flex-1">{note.message}</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-500 hover:text-red-500"
								onClick={() => removeNotification(index)}
							>
								<X className="w-4 h-4" />
							</Button>
						</DropdownMenuItem>
					))
				) : (
					<p className="text-center py-2 text-sm text-gray-500">
						No notifications
					</p>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
