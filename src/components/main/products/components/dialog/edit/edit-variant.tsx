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
} from "@/components/ui/dialog";

import { requestHandler } from "@/lib/utils";

import { updateVariantAPI } from "@/api/ecommerce";
import { editProductVariantSchema } from "@/lib/schemas/products/create-variant";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { useParams } from "next/navigation";

import { AvailableProductSizes } from "@/lib/schemas/products/create-variant";
import { Input } from "@/components/ui/input";

import { VariantInterface } from "@/types/app";

type VariantFormData = z.infer<typeof editProductVariantSchema>;

export function EditVariantDialog({
	open,
	setOpen,
	variant,
	fetchVariant,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	variant: VariantInterface;
	fetchVariant: () => void;
}) {
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const [selectedSizes, setSelectedSizes] = useState<string[]>(variant.size);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<VariantFormData>({
		resolver: zodResolver(editProductVariantSchema),
	});

	const onSubmit = async (data: VariantFormData) => {
		requestHandler(
			async () => updateVariantAPI(id, data),
			setLoading,
			() => {
				fetchVariant();
				reset();
				setOpen(false);
				toast.success("Variant update successfully.");
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
				color: variant.color,
				material: variant.material,
				size: JSON.stringify(variant.size),
				stockQty: Number(variant.stockQty),
				additionalPrice: Number(variant.additionalPrice),
				title: variant.title,
			});
			setSelectedSizes(variant.size);
		}
	}, [open, reset, variant]);

	// For form submission
	useEffect(() => {
		setValue("size", JSON.stringify(selectedSizes)); // from react-hook-form

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSizes]);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) reset(); // reset only when dialog is being closed
			}}
		>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit Variant Attributes</DialogTitle>
					<DialogDescription>
						Fill in the variant details and click save changes.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<div className="space-y-2 w-full">
						<Label htmlFor="name">Title</Label>
						<Input
							id="title"
							placeholder="Enter variant title"
							{...register("title")}
						/>
						{errors.title && (
							<p className="text-sm text-red-500">{errors.title.message}</p>
						)}
					</div>
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
					<div className="w-full flex gap-2 sm:flex-row flex-col">
						<div className="space-y-2 w-full">
							<Label htmlFor="stockQty">Stock Quantity</Label>
							<Input
								id="stockQty"
								type="number"
								step="1.00"
								placeholder="Enter variant stock quantity"
								{...register("stockQty")}
							/>
							{errors.stockQty && (
								<p className="text-sm text-red-500">
									{errors.stockQty.message}
								</p>
							)}
						</div>

						{/* Additional Price */}
						<div className="space-y-2 w-full">
							<Label htmlFor="additionalPrice">Additional Price</Label>
							<Input
								id="additionalPrice"
								type="number"
								step="1.00"
								placeholder="Enter variant additional price"
								{...register("additionalPrice")}
							/>
							{errors.additionalPrice && (
								<p className="text-sm text-red-500">
									{errors.additionalPrice.message}
								</p>
							)}
						</div>
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
