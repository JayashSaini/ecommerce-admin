import { DataTable } from "@/components/layout/data-table";
import { Filters } from "./components/filters";

import { SearchBar } from "./components/searchbar";
import data from "@/app/dashboard/data.json";

export function Products() {
	return (
		<div className="w-full h-auto min-h-96">
			<div className="w-full flex justify-between px-2 items-center">
				<Filters />
				<SearchBar />
			</div>
			<DataTable data={data} />
		</div>
	);
}
