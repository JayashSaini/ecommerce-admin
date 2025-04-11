/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";

import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import Image from "next/image";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { requestHandler } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createVariantAPI } from "@/api/ecommerce";
import {
	AvailableProductSizes,
	createProductVariantSchema,
} from "@/lib/schemas/products/create-variant";

type VariantFormData = z.infer<typeof createProductVariantSchema>;

export function CreateVariantDialog({ productId }: { productId: number }) {
	const [loading, setLoading] = useState(false);

	const [imageLimitError, setImageLimitError] = useState("");
	const [imageSizeError, setImageSizeError] = useState("");
	const [open, setOpen] = useState(false);

	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<VariantFormData>({
		resolver: zodResolver(createProductVariantSchema),
	});

	const images = watch("images");

	const onDrop = (acceptedFiles: File[]) => {
		// Reset previous errors
		setImageLimitError("");
		setImageSizeError("");

		const oversized = acceptedFiles.filter(
			(file) => file.size > 2 * 1024 * 1024
		);
		const totalImages = acceptedFiles.length;

		if (totalImages > 4) {
			setImageLimitError("Maximum 4 images are allowed.");
			return;
		}

		if (oversized.length > 0) {
			setImageSizeError("One or more images exceed the 2MB size limit.");
			return;
		}

		// No error — set value
		setValue("images", acceptedFiles as any, { shouldValidate: true });
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxSize: 2 * 1024 * 1024,
	});

	const onSubmit = async (data: VariantFormData) => {
		console.log("data is ----------- : ", data);
		const formData = new FormData();
		// Loop through all data fields
		(Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
			if (key === "images") {
				data.images.forEach((file) => {
					formData.append("images", file);
				});
			} else {
				formData.append(key, data[key] as any);
			}
		});

		requestHandler(
			async () => createVariantAPI(formData),
			setLoading,
			({ data }) => {
				console.log("data is:", data);
				toast.success("Variant created successfully.");
				reset();
				setOpen(false);
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
		setValue("productId", productId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSizes]);
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setOpen(!open);
				reset();
				setSelectedSizes([]);
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="default"
				>
					<IconPlus />
					<span className="sm:flex hidden">New Variant</span>
				</Button>
			</DialogTrigger>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Create Variant</DialogTitle>
					<DialogDescription>
						Fill in the variant details and click create.
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

					{/* Base Price */}
					<div className="space-y-2">
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

					{/* Base Price */}
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

					{/* Images */}
					<div className="space-y-2">
						<Label>Images</Label>
						{/* Dropzone area */}
						<div
							{...getRootProps()}
							className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
						>
							<input
								id="images"
								name="images"
								{...getInputProps()}
							/>
							<p className="text-sm text-muted-foreground">
								Drag and drop up to 4 images here, or click to select files
								(Max: 2MB each)
							</p>
						</div>

						{/* Show Zod error */}
						{errors.images && (
							<p className="text-sm text-red-500">{errors.images.message}</p>
						)}

						{/* Show custom dropzone errors */}
						{imageLimitError && (
							<p className="text-sm text-red-500">{imageLimitError}</p>
						)}
						{imageSizeError && (
							<p className="text-sm text-red-500">{imageSizeError}</p>
						)}
					</div>

					{/* Preview Images */}
					{Array.isArray(images) && images.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{images.map((file: File, idx: number) => (
								<div
									key={idx}
									className="w-20 h-20 border rounded overflow-hidden"
								>
									<Image
										src={URL.createObjectURL(file)}
										alt={`Preview ${idx + 1}`}
										className="w-full h-full object-cover"
										width={80}
										height={80}
									/>
								</div>
							))}
						</div>
					)}

					{/* Submit */}
					<DialogFooter className="mt-4">
						<Button
							type="submit"
							disabled={loading}
							isLoading={loading}
						>
							Create Variant
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
