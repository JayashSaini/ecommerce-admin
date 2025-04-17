"use client";
import { Slash } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type Crumb = {
	text: string;
	link?: string | null;
};

interface BreadcrumbProps {
	items: Crumb[];
}

export function CustomBreadcrumb({ items }: BreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<div
						key={index}
						className="flex items-center gap-3"
					>
						<BreadcrumbItem>
							{item.link ? (
								<BreadcrumbLink asChild>
									<Link
										href={item.link}
										className="truncate text-sm"
									>
										{item.text}
									</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="truncate">
									{item.text}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>

						{/* Show separator unless it's the last item */}
						{index < items.length - 1 && (
							<BreadcrumbSeparator>
								<Slash />
							</BreadcrumbSeparator>
						)}
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
