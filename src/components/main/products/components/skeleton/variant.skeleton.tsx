import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VariantLayoutSkeleton() {
	return (
		<div className="w-full h-auto flex flex-col gap-4">
			{/* Top Section: Info + Media */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				{/* Product Info */}
				<Card className="@container/card col-span-3 flex flex-col justify-between">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">
							<Skeleton className="h-5 w-40" />
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
					</CardContent>
					<CardFooter>
						<Skeleton className="h-6 w-28 rounded-full" />
					</CardFooter>
				</Card>

				{/* Media Preview */}
				<Card className="@container/card col-span-2">
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-24" />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex overflow-x-auto gap-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={`image-${i}`}
								className="h-24 w-24 min-w-[96px] rounded-md"
							/>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Middle Section: Attributes + Insights */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				{/* Attributes */}
				<Card className="@container/card col-span-2 flex flex-col justify-between">
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-5 w-24" />
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						<div className="flex gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton
									key={`size-${i}`}
									className="h-6 w-10 rounded-md"
								/>
							))}
						</div>
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
					</CardContent>
					<CardFooter>
						<Skeleton className="h-4 w-32" />
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
