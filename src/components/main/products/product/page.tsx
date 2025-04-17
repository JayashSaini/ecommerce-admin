"use client";

import { getProductByIdAPI } from "@/api/ecommerce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requestHandler } from "@/lib/utils";
import { ProductInterface } from "@/types/app";
import {
	IconArchive,
	IconCircleCheckFilled,
	IconDots,
	IconLoader,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductLayoutSkeleton } from "../components/skeleton/product.skeleton";

import { ProductCharts } from "../components/product-chart";
import { VariantTable } from "../components/variant-table";
import FullscreenImage from "../../../common/fullscreen-image";
import { CustomBreadcrumb } from "@/components/common/breadcrum";

export function Page() {
	const { id } = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<null | ProductInterface>(null);

	const fetchProduct = async () => {
		await requestHandler(
			() => getProductByIdAPI(id?.toString() || ""),
			null,
			({ data }) => {
				setProduct(data);
			},
			(e) => {
				toast.error(e);
				router.back();
			}
		);
	};
	useEffect(() => {
		fetchProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return !product ? (
		<ProductLayoutSkeleton />
	) : (
		<>
			<div className="mb-3">
				<CustomBreadcrumb
					items={[
						{
							text: "Products",
							link: "/dashboard/products",
						},
						{
							text: product.name,
							link: `/dashboard/products/${product.id}`,
						},
					]}
				/>
			</div>
			<div className="w-full h-auto grid grid-cols-5 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs ">
				<Card className="@container/card  col-span-5 md:col-span-3 gap-4">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">
							{product?.name}
						</CardTitle>
						<CardAction>
							<div className="flex sm:gap-4 gap-2">
								<Badge
									variant="outline"
									className="text-muted-foreground px-1.5"
								>
									{product?.status === "PUBLISHED" ? (
										<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
									) : product?.status === "UNPUBLISHED" ? (
										<IconLoader className="text-destructive" />
									) : (
										<IconArchive />
									)}
									{product?.status}
								</Badge>
								<IconDots className="w-5 text-secondary-foreground cursor-pointer" />
							</div>
						</CardAction>
					</CardHeader>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-1 col-span-2 ">
							Description
						</h3>
						<CardDescription className="sm:col-span-4 col-span-3">
							{product?.description}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-1 col-span-2 ">
							Price
						</h3>
						<CardDescription className="sm:col-span-4 col-span-3">
							&#8377;{product?.basePrice}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-1 col-span-2 ">
							Category
						</h3>
						<CardDescription className="sm:col-span-4 col-span-3">
							{product?.category?.name}
						</CardDescription>
					</CardContent>
				</Card>
				{/* Child 2 – 40% */}
				<Card className="@container/card  col-span-5 md:col-span-2">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">Media</CardTitle>
						<CardAction>
							<IconDots className="w-5 text-secondary-foreground cursor-pointer" />
						</CardAction>
					</CardHeader>
					<Separator />
					<CardContent className="w-full  flex overflow-auto gap-4 py-2">
						{product?.images.map((image) => (
							<FullscreenImage
								alt="product images"
								src={image.url}
								key={image.key}
								width={110}
								height={110}
								className="rounded-xl"
							/>
						))}
					</CardContent>
				</Card>
				{/* Child 3 – 40% */}
				<Card className=" h-fit @container/card  col-span-5 md:col-span-2">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">Attributes</CardTitle>
						<CardAction>
							<IconDots className="w-5 text-secondary-foreground cursor-pointer" />
						</CardAction>
					</CardHeader>
					<Separator />
					<CardContent className="w-full   gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">Size</h3>
						<CardDescription className="col-span-3">
							{product?.size && product?.size?.length > 0 ? (
								<div className="flex gap-2">
									{product?.size.map((size, i) => (
										<Button
											variant="outline"
											size="sm"
											className="text-xs px"
											key={i}
										>
											{size}
										</Button>
									))}
								</div>
							) : (
								"-"
							)}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full   gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">Color</h3>
						<CardDescription className="col-span-3">
							{product?.color || "-"}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">
							Material
						</h3>
						<CardDescription className="col-span-3">
							{product?.material || "-"}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardFooter className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">
							Stock Quantity
						</h3>
						<CardDescription className="col-span-3">
							{product?.stockQty || "-"}
						</CardDescription>
					</CardFooter>
				</Card>
				{/* Child 4 – 60% */}
				<ProductCharts />
				{/* Child 5 – 100% */}
				<VariantTable
					key={JSON.stringify(product?.variants)}
					initialData={Array.isArray(product?.variants) ? product.variants : []}
					reloadProduct={fetchProduct}
					productId={product.id}
				/>
			</div>
		</>
	);
}
