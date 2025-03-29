import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

export function SearchBar() {
	return (
		<div className="relative">
			<IconSearch
				size={18}
				className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
			/>
			<Input
				type="text"
				placeholder="Search"
				className="pl-8 pr-2 py-1 border rounded-md bg-transparent dark:bg-transparent focus:outline-none focus:ring-0 dark:focus:ring-0"
				style={{ maxWidth: "150px" }}
			/>
		</div>
	);
}
