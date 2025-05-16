"use client";

import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";

import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function SearchBar() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			{/* Search Box Trigger */}
			<div
				className="relative cursor-pointer bg-background "
				onClick={() => setOpen(true)}
			>
				<IconSearch
					size={16}
					className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
				/>

				<Input
					readOnly
					placeholder="Search"
					className="pl-8 pr-16 py-2 h-9  dark:bg-background cursor-pointer placeholder:text-sm border-border/70 rounded-sm"
				/>

				{/* Shortcut Hint (⌘k) */}
				<div className="absolute right-2 top-1/2 -translate-y-1/2">
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground ">
						<span className="text-xs">
							{navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
						</span>
						K
					</kbd>
				</div>
			</div>

			{/* Command Dialog */}
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				{/* Accessibility title */}
				<VisuallyHidden>
					<DialogTitle>Search Command Menu</DialogTitle>
				</VisuallyHidden>

				<Command className="rounded-lg border shadow-md md:min-w-[450px]">
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<Calendar />
								<span>Calendar</span>
							</CommandItem>
							<CommandItem>
								<Smile />
								<span>Search Emoji</span>
							</CommandItem>
							<CommandItem disabled>
								<Calculator />
								<span>Calculator</span>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Settings">
							<CommandItem>
								<User />
								<span>Profile</span>
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<CreditCard />
								<span>Billing</span>
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Settings />
								<span>Settings</span>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
