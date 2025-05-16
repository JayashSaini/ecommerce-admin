/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";

import { createProductSchema } from "@/lib/schemas/products/create-product";
import { toast } from "sonner";
import { IconCirclePlusFilled, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
import { useAppSelector } from "@/store/hooks";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, requestHandler } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createProductAPI } from "@/api/ecommerce";
import Image from "next/image";

type ProductFormData = z.infer<typeof createProductSchema>;

export function CreateProductDialog({
	isProductPage = true,
}: {
	isProductPage?: boolean;
}) {
	const [loading, setLoading] = useState(false);
	const { categories } = useAppSelector((state) => state.dashboard);
	const [imageLimitError, setImageLimitError] = useState("");
	const [imageSizeError, setImageSizeError] = useState("");
	const [open, setOpen] = useState(false);
	const [categoryOpen, setCategoryOpen] = useState(false);
	const [selectCategory, setSelectCategory] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<ProductFormData>({
		resolver: zodResolver(createProductSchema),
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

	const onSubmit = async (data: ProductFormData) => {
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
			async () => createProductAPI(formData),
			setLoading,
			({ data }) => {
				console.log("data is ; ", data);
				toast.success("Product created successfully.");
				reset();
				setCategoryOpen(false);
				setOpen(false);
			},
			(e) => toast.error(e)
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				{isProductPage ? (
					<Button
						variant="outline"
						size="sm"
						className="text-xs"
					>
						<IconPlus />
						<span className="sm:flex hidden">New Product</span>
					</Button>
				) : (
					<SidebarMenuButton
						tooltip="Quick Create"
						className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
					>
						<IconCirclePlusFilled />
						<span>Quick Create</span>
					</SidebarMenuButton>
				)}
			</DialogTrigger>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Create Product</DialogTitle>
					<DialogDescription>
						Fill in the product details and click create.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
				>
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Enter product name"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter product description"
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Base Price */}
					<div className="space-y-2">
						<Label htmlFor="basePrice">Base Price</Label>
						<Input
							id="basePrice"
							type="number"
							step="1.00"
							placeholder="Enter base price"
							{...register("basePrice")}
						/>
						{errors.basePrice && (
							<p className="text-sm text-red-500">{errors.basePrice.message}</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label htmlFor="categoryId">Category</Label>

						<Popover
							open={categoryOpen}
							onOpenChange={setCategoryOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={categoryOpen}
									className="w-[250px] justify-between"
								>
									{selectCategory
										? selectCategory
										: categories.find((c) => c.name === selectCategory)?.name ||
										  "Select category..."}
									<ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
								</Button>
							</PopoverTrigger>

							<PopoverContent className=" p-0">
								<Command className="border rounded-md">
									<CommandInput
										placeholder="Search category..."
										className="h-9"
									/>
									<CommandList>
										<CommandEmpty>No category found.</CommandEmpty>
										<CommandGroup>
											{categories.map((category) => (
												<CommandItem
													key={category.id}
													value={category.name}
													onSelect={() => {
														setValue("categoryId", category.id, {
															shouldValidate: true,
														});
														setSelectCategory(category.name);
														setCategoryOpen(false);
													}}
												>
													{category.name}
													<Check
														className={cn(
															"ml-auto",
															category.name === selectCategory
																? "opacity-100"
																: "opacity-0"
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>

						{/* Error display */}
						{errors.categoryId && (
							<p className="text-sm text-red-500">
								{errors.categoryId.message}
							</p>
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
							Create Product
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
