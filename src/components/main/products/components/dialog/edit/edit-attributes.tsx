/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { requestHandler } from "@/lib/utils";

import { updateProductAPI } from "@/api/ecommerce";
import { createProductVariantSchema } from "@/lib/schemas/products/create-product";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { useParams } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";
import { AvailableProductSizes } from "@/lib/schemas/products/create-variant";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type ProductFormData = z.infer<typeof createProductVariantSchema>;

export function EditProductAttributeDialog({
	open,
	setOpen,
	color,
	material,
	size,
	stockQty,
	fetchProductDetails,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	color: string;
	material: string;
	size: string[];
	stockQty: number;
	fetchProductDetails: () => void;
}) {
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const [selectedSizes, setSelectedSizes] = useState<string[]>(size);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<ProductFormData>({
		resolver: zodResolver(createProductVariantSchema),
	});

	const onSubmit = async (data: ProductFormData) => {
		requestHandler(
			async () => updateProductAPI(id as string, data),
			setLoading,
			({}) => {
				fetchProductDetails();
				reset();
				setOpen(false);
				toast.success("Product attributes update successfully.");
			},
			(e) => toast.error(e)
		);
	};

	const toggleSize = (size: string) => {
		setSelectedSizes((prev) =>
			prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
		);
	};

	// For form submission
	useEffect(() => {
		setValue("size", JSON.stringify(selectedSizes)); // from react-hook-form

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSizes]);

	useEffect(() => {
		if (open) {
			reset({
				color,
				material,
				size: JSON.stringify(size),
				stockQty,
			});
			setSelectedSizes(size);
		}
	}, [open, color, material, size, stockQty, reset]);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) reset(); // reset only when dialog is being closed
			}}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<button type="button">
							<IconEdit className="w-[20px] cursor-pointer text-secondary-foreground hover:text-secondary-foreground" />
						</button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Edit Attributes</TooltipContent>
			</Tooltip>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit Product Attributes</DialogTitle>
					<DialogDescription>
						Fill in the attributes details and click save changes.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<div className="w-full flex gap-2 sm:flex-row flex-col">
						<div className="space-y-2 w-full">
							<Label htmlFor="name">Color</Label>
							<Input
								id="color"
								placeholder="Enter variant color"
								{...register("color")}
							/>
							{errors.color && (
								<p className="text-sm text-red-500">{errors.color.message}</p>
							)}
						</div>

						<div className="space-y-2 w-full">
							<Label htmlFor="name">Material</Label>
							<Input
								id="material"
								placeholder="Enter variant material"
								{...register("material")}
							/>
							{errors.material && (
								<p className="text-sm text-red-500">
									{errors.material.message}
								</p>
							)}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="stockQty">Stock Quantity</Label>
						<Input
							id="stockQty"
							type="number"
							step="1.00"
							placeholder="Enter variant stock quantity"
							{...register("stockQty")}
						/>
						{errors.stockQty && (
							<p className="text-sm text-red-500">{errors.stockQty.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>Sizes</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									className="w-full justify-between"
								>
									{selectedSizes.length > 0
										? selectedSizes.join(", ")
										: "Select Sizes"}
									<Check className="ml-2 h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[200px] p-0"
								align="start"
							>
								<Command>
									<CommandGroup>
										{AvailableProductSizes.map((size) => (
											<CommandItem
												key={size}
												onSelect={() => toggleSize(size)}
												className="flex items-center justify-between"
											>
												<span>{size}</span>
												{selectedSizes.includes(size) && (
													<Check className="h-4 w-4 text-primary" />
												)}
											</CommandItem>
										))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						{errors.size && (
							<p className="text-sm text-red-500">{errors.size.message}</p>
						)}
					</div>

					{/* Submit */}
					<DialogFooter className="mt-4">
						<Button
							type="submit"
							disabled={loading}
							isLoading={loading}
						>
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
