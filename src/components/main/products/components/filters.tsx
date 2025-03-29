import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
	IconFilter,
	IconClock,
	IconTrendingUp,
	IconPackage,
	IconCheck,
	IconX,
	IconTag,
	IconSortAscending,
	IconSortDescending,
} from "@tabler/icons-react";

export function Filters() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="text-secondary-foreground flex items-center gap-2"
				>
					<IconFilter size={18} />
					Filters
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="sm:w-56 w-44"
			>
				{/* Status Filter */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconCheck
							size={18}
							className="mr-2"
						/>{" "}
						Status
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<IconCheck
								size={18}
								className="mr-2"
							/>{" "}
							Published
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconX
								size={18}
								className="mr-2"
							/>{" "}
							Unpublished
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{/* Stock Filter */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconPackage
							size={18}
							className="mr-2"
						/>{" "}
						Stock
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<IconPackage
								size={18}
								className="mr-2"
							/>{" "}
							In Stock
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconX
								size={18}
								className="mr-2"
							/>{" "}
							Out of Stock
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{/* Sorting Filter */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconSortAscending
							size={18}
							className="mr-2"
						/>{" "}
						Sorting
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<IconClock
								size={18}
								className="mr-2"
							/>{" "}
							Latest
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconSortAscending
								size={18}
								className="mr-2"
							/>{" "}
							Oldest
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconTrendingUp
								size={18}
								className="mr-2"
							/>{" "}
							Best Selling
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconSortDescending
								size={18}
								className="mr-2"
							/>{" "}
							Price (High to Low)
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconSortAscending
								size={18}
								className="mr-2"
							/>{" "}
							Price (Low to High)
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{/* Category Filter */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconTag
							size={18}
							className="mr-2"
						/>{" "}
						Category
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<IconTag
								size={18}
								className="mr-2"
							/>{" "}
							Men’s T-Shirts
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconTag
								size={18}
								className="mr-2"
							/>{" "}
							Women’s T-Shirts
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconTag
								size={18}
								className="mr-2"
							/>{" "}
							Kids’ T-Shirts
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{/* Separator for better UI */}
				<DropdownMenuSeparator />

				{/* Reset Filters */}
				<DropdownMenuItem
					variant="destructive"
					className=" font-semibold"
				>
					<IconX
						size={18}
						className="mr-2"
					/>{" "}
					Reset Filters
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
