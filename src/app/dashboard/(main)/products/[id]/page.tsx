import { Page as ProductPage } from "@/components/main/products/product/page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SLYIX APPAREL | Products",
	description: "SLYIX APPAREL | Products",
};

export default function Page() {
	return (
		<div className="w-full sm:p-6 p-4">
			<ProductPage />
		</div>
	);
}
