"use client";

import { deleteVariantImageAPI, getVariantByIdAPI } from "@/api/ecommerce";
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
import { VariantInterface } from "@/types/app";
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
import { VariantLayoutSkeleton } from "../components/skeleton/variant.skeleton";

import { CustomBreadcrumb } from "@/components/common/breadcrum";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditVariantDialog } from "../components/dialog/edit/edit-variant";
import { DeleteVariantDialog } from "../components/dialog/delete-variant";
import ScrollContainer from "react-indiana-drag-scroll";
import { VariantMedia } from "../components/varitant-media";
import { ParamValue } from "next/dist/server/request/params";

export function Variant() {
	const { id } = useParams();
	const router = useRouter();
	const [variant, setVariant] = useState<null | VariantInterface>(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [variantLoading, setVariantLoading] = useState(false);

	const fetchVariant = async () => {
		await requestHandler(
			() => getVariantByIdAPI(id?.toString() || ""),
			setVariantLoading,
			({ data }) => {
				setVariant(data);
			},
			(e) => {
				toast.error(e);
				router.back();
			}
		);
	};
	useEffect(() => {
		fetchVariant();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const deleteVariantImage = async (
		variantId: ParamValue,
		imageKey: string
	) => {
		await requestHandler(
			() => deleteVariantImageAPI(variantId, imageKey),
			null,
			async () => {
				await fetchVariant();
				toast.success("Variant image deleted successfully.");
			},
			(e) => {
				toast.error(e);
			}
		);
	};

	return !variant || variantLoading ? (
		<VariantLayoutSkeleton />
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
							text: variant?.product?.name || "",
							link: `/dashboard/products/${variant?.product?.id}`,
						},
						{
							text: variant.title,
							link: `/dashboard/products/variants/${variant.id}`,
						},
					]}
				/>
			</div>

			<div className="w-full h-auto grid grid-cols-5 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs ">
				<Card className="@container/card  col-span-5 md:col-span-3 gap-4">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">
							{variant?.title}
						</CardTitle>
						<CardAction>
							<div className="flex sm:gap-4 gap-2">
								<Badge
									variant="outline"
									className="text-muted-foreground px-1.5"
								>
									{variant?.product?.status === "PUBLISHED" ? (
										<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
									) : variant?.product?.status === "UNPUBLISHED" ? (
										<IconLoader className="text-destructive" />
									) : (
										<IconArchive />
									)}
									{variant?.product?.status}
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
						<h3 className="text-card-foreground text-sm sm:col-span-2 col-span-2 ">
							Product Name
						</h3>
						<CardDescription className="sm:col-span-3 col-span-3">
							{variant?.product?.name}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-2 col-span-2 ">
							Description
						</h3>
						<CardDescription className="sm:col-span-3 col-span-3">
							{variant?.product?.description}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-2 col-span-2 ">
							Base Price
						</h3>
						<CardDescription className="sm:col-span-3 col-span-3">
							&#8377;
							{variant?.product?.basePrice}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm sm:col-span-2 col-span-2 ">
							Additional Price
						</h3>
						<CardDescription className="sm:col-span-3 col-span-3">
							&#8377;
							{variant?.additionalPrice}
						</CardDescription>
					</CardContent>
				</Card>
				{/* Child 2 – 40% */}
				<VariantMedia
					variantId={variant.id}
					images={variant.images}
					deleteImages={(productId, imageKey) => {
						deleteVariantImage(productId, imageKey);
					}}
					fetchVariant={fetchVariant}
				/>

				{/* Child 3 – 40% */}
				<Card className=" h-fit @container/card  col-span-5 md:col-span-2">
					<CardHeader>
						<CardTitle className="sm:text-md text-base">Attributes</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="w-full   gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">Size</h3>
						<CardDescription className="col-span-3 overflow-hidden">
							{variant?.size && variant?.size.length > 0 ? (
								<ScrollContainer
									className="max-w-full overflow-x-auto flex gap-2 cursor-grab active:cursor-grabbing pb-1"
									vertical={false}
								>
									<div className="flex gap-2 w-max">
										{variant.size.map((size, i) => (
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
							{variant?.color || "-"}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardContent className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">
							Material
						</h3>
						<CardDescription className="col-span-3">
							{variant?.material || "-"}
						</CardDescription>
					</CardContent>
					<Separator />
					<CardFooter className="w-full  gap-4 grid grid-cols-5">
						<h3 className="text-card-foreground text-sm col-span-2 ">
							Stock Quantity
						</h3>
						<CardDescription className="col-span-3">
							{variant?.stockQty || "-"}
						</CardDescription>
					</CardFooter>
				</Card>
			</div>
			{/* Rendering dialogs boxes */}
			<EditVariantDialog
				open={openEditDialog}
				setOpen={setOpenEditDialog}
				variant={variant}
				fetchVariant={fetchVariant}
			/>
			<DeleteVariantDialog
				open={openDeleteDialog}
				setOpen={setOpenDeleteDialog}
				id={variant.id.toString()}
			/>
		</>
	);
}
