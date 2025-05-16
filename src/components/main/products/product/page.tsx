"use client";

import { deleteProductImageAPI, getProductByIdAPI } from "@/api/ecommerce";
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
	IconEdit,
	IconLoader,
	IconTrash,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductLayoutSkeleton } from "../components/skeleton/product.skeleton";

import { ProductCharts } from "../components/product-chart";
import { VariantTable } from "../components/variant-table";
import { CustomBreadcrumb } from "@/components/common/breadcrum";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProductDialog } from "../components/dialog/edit/edit-project";
import { DeleteProductDialog } from "../components/dialog/delete-product";
import { EditProductAttributeDialog } from "../components/dialog/edit/edit-attributes";
import ScrollContainer from "react-indiana-drag-scroll";
import { ProductMedia } from "../components/product-media";

export function Page() {
	const { id } = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<null | ProductInterface>(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditAttributeDialog, setOpenEditAttributeDialog] = useState(false);
	const [productLoader, setProductLoader] = useState(false);

	const fetchProduct = async () => {
		await requestHandler(
			() => getProductByIdAPI(id?.toString() || ""),
			setProductLoader,
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

	const deleteProductImage = async (productId: string, imageKey: string) => {
		await requestHandler(
			() => deleteProductImageAPI(productId, imageKey),
			null,
			async ({ data }) => {
				setProduct(data);
				await fetchProduct();
				toast.success("Product image deleted successfully.");
			},
			(e) => {
				toast.error(e);
			}
		);
	};

	return productLoader || !product ? (
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

								<DropdownMenu>
									<DropdownMenuTrigger>
										<IconDots className="w-5 text-secondary-foreground cursor-pointer" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											className="cursor-pointer"
											onClick={() => setOpenEditDialog(true)}
										>
											<IconEdit className="w-4 h-4 mr-2 text-muted-foreground" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="cursor-pointer"
											onClick={() => setOpenDeleteDialog(true)}
										>
											<IconTrash className="w-4 h-4 mr-2 text-muted-foreground" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
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
				<ProductMedia
					productId={product.id}
					images={product.images}
					deleteImages={(productId, imageKey) => {
						deleteProductImage(productId, imageKey);
					}}
					fetchProduct={fetchProduct}
				/>
				{/* Child 3 – 40% */}
				<Card className=" h-fit @container/card  col-span-5 md:col-span-2">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">Attributes</CardTitle>
						<CardAction>
							<EditProductAttributeDialog
								open={openEditAttributeDialog}
								setOpen={setOpenEditAttributeDialog}
								color={product?.color || ""}
								size={product?.size || []}
								material={product?.material || ""}
								stockQty={Number(product?.stockQty) || 0}
								fetchProductDetails={() => {
									fetchProduct();
								}}
							/>
						</CardAction>
					</CardHeader>
					<Separator />
					<CardContent className="w-full gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2">Size</h3>
						<CardDescription className="col-span-3 overflow-hidden">
							{product?.size && product?.size.length > 0 ? (
								<ScrollContainer
									className="max-w-full overflow-x-auto flex gap-2 cursor-grab active:cursor-grabbing pb-1"
									vertical={false}
								>
									<div className="flex gap-2 w-max">
										{product.size.map((size, i) => (
											<Button
												variant="outline"
												size="sm"
												className="text-xs select-none"
												key={i}
											>
												{size}
											</Button>
										))}
									</div>
								</ScrollContainer>
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

			{/* Rendering dialogs boxes */}
			<EditProductDialog
				open={openEditDialog}
				setOpen={setOpenEditDialog}
			/>
			<DeleteProductDialog
				open={openDeleteDialog}
				setOpen={setOpenDeleteDialog}
			/>
		</>
	);
}
