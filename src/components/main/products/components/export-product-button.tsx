"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { IconDownload } from "@tabler/icons-react";
import { utils, writeFile } from "xlsx";

export default function ExportProductsButton() {
	const { products } = useAppSelector(
		(state) => state.dashboard.paginatedProducts
	);

	const handleExport = () => {
		const simplifiedData = products.map((product) => ({
			ID: product.id,
			Name: product.name,
			Description: product.description,
			"Base Price (₹)": `₹${Number(product.basePrice).toLocaleString("en-IN")}`,
			Category: product?.category?.name,
			Status: product.status,
			CreatedAt: product.createdAt,
			Images: product.images.map((img) => img.url).join(", "),
		}));

		const worksheet = utils.json_to_sheet(simplifiedData);
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, worksheet, "Products");
		writeFile(workbook, "products.xlsx");
	};

	return (
		<Button
			variant="outline"
			size="sm"
			className="text-xs"
			onClick={handleExport}
		>
			<IconDownload />
			<span className="sm:flex hidden">Export Products</span>
		</Button>
	);
}
