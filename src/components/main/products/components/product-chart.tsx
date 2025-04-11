"use client";

import { ExternalLink } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

import {
	TooltipTrigger,
	Tooltip,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const chartData = [
	{ month: "January", sold: 186 },
	{ month: "February", sold: 305 },
	{ month: "March", sold: 237 },
	{ month: "April", sold: 73 },
	{ month: "May", sold: 209 },
	{ month: "June", sold: 214 },
];

const chartConfig = {
	sold: {
		label: "Product Sold : ",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function ProductCharts() {
	return (
		<Card className="@container/card col-span-5 md:col-span-3 ">
			<CardHeader>
				<CardTitle className="sm:text-md text-base">Product Insights</CardTitle>
				<CardAction>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
							>
								<ExternalLink className="w-5 h-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Detailed product insights</TooltipContent>
					</Tooltip>
				</CardAction>
			</CardHeader>
			<Separator />
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 10,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Bar
							dataKey="sold"
							fill="var(--primary)"
							radius={8}
						>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
