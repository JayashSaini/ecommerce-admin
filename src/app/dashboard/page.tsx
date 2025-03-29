import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive";
import { DataTable } from "@/components/layout/data-table";
import { SectionCards } from "@/components/layout/section-cards";

import data from "./data.json";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SLYIX APPAREL | Admin Dashboard & Analytics",
	description: "SLYIX APPAREL | Admin Dashboard & Analytics",
};

export default function Page() {
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards />
			<div className="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>
			<DataTable data={data} />
		</div>
	);
}
