"use client";
import { Filters } from "./components/filters";
import { SearchBar } from "./components/searchbar";
import { ProductTable } from "./components/product-table";
import { Button } from "@/components/ui/button";
import { IconReload } from "@tabler/icons-react";
import { useAppDispatch } from "@/store/hooks";
import { getProducts } from "@/features/thunk/dashboardThunk";
import { useState } from "react";

export function Products() {
	const [reloadLoading, setReloadLoading] = useState(false);
	const dispatch = useAppDispatch();
	const onProductsReloadHandler = async () => {
		setReloadLoading(true);
		await dispatch(getProducts());
		setReloadLoading(false);
	};
	return (
		<div className="w-full h-auto ">
			<div className="w-full flex justify-between px-2 items-center mb-2">
				<Filters />
				<div className="flex gap-2">
					<SearchBar />
					<Button
						variant="outline"
						size="icon"
						onClick={onProductsReloadHandler}
						disabled={reloadLoading}
					>
						{reloadLoading ? (
							<IconReload className="h-[1.2rem] w-[1.2rem] transition-all animate-spin" />
						) : (
							<IconReload className="h-[1.2rem] w-[1.2rem] transition-all " />
						)}
						<span className="sr-only">Reload products</span>
					</Button>
				</div>
			</div>
			<ProductTable />
		</div>
	);
}
