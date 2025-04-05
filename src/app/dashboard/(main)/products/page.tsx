import { Layout } from "@/components/main/products/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SLYIX APPAREL | Products",
	description: "SLYIX APPAREL | Products",
};

export default function Page() {
	return (
		<div className="w-full sm:p-6 p-4">
			<div className="bg-gradient-to-b from-background via-background/50 to-primary/5 flex flex-col rounded-xl border sm:py-6 py-4 sm:px-3 px-2 shadow-sm">
				<Layout />
			</div>
		</div>
	);
}
