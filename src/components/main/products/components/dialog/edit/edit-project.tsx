/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

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
} from "@/components/ui/dialog";

import { cn, requestHandler } from "@/lib/utils";

import { updateProductAPI } from "@/api/ecommerce";
import { editProductSchema } from "@/lib/schemas/products/create-product";
import { CommandList } from "cmdk";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from "@/store/hooks";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

type ProductFormData = z.infer<typeof editProductSchema>;

export function EditProductDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [loading, setLoading] = useState(false);

	const [categoryOpen, setCategoryOpen] = useState(false);
	const [selectCategory, setSelectCategory] = useState("");
	const { id } = useParams();

	const { categories } = useAppSelector((state) => state.dashboard);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<ProductFormData>({
		resolver: zodResolver(editProductSchema),
		defaultValues: {
			basePrice: undefined,
		},
	});

	const onSubmit = async (data: ProductFormData) => {
		requestHandler(
			async () => updateProductAPI(id as string, data),
			setLoading,
			({ data }) => {
				reset();
				setOpen(false);
				window.location.reload();
			},
			(e) => toast.error(e)
		);
	};

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
					<DialogTitle>Edit Product</DialogTitle>
					<DialogDescription>
						Fill in the product details and click submit.
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
							required={false}
							{...register("basePrice", {
								setValueAs: (val) => (val === "" ? undefined : val),
							})}
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

					{/* Submit */}
					<DialogFooter className="mt-4">
						<Button
							type="submit"
							disabled={loading}
							isLoading={loading}
						>
							Submit
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
