import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx"; // or use classnames if you prefer

interface SearchBarProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string; // optional prop to override/extend classes
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
	return (
		<div className="relative">
			<IconSearch
				size={18}
				className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
			/>
			<Input
				type="text"
				placeholder="Search"
				className={clsx(
					"pl-8 pr-2 py-1 border rounded-md bg-transparent dark:bg-transparent focus:outline-none focus:ring-0 dark:focus:ring-0",
					className
				)}
				style={{ maxWidth: "150px" }}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}
