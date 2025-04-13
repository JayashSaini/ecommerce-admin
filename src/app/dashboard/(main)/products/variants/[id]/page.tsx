import { Variant } from "@/components/main/products/variant/page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SLYIX APPAREL | Variants",
	description: "SLYIX APPAREL | Variants",
};

export default function Page() {
	return (
		<div className="w-full sm:p-6 p-4">
			<Variant />
		</div>
	);
}
