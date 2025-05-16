/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";

import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

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
import { uploadProductImageAPI, uploadVariantImageAPI } from "@/api/ecommerce";

import Image from "next/image";

// Zod schema (only one image required)
const formSchema = z.object({
	image: z
		.instanceof(File, { message: "An image file is required" })
		.refine((file) => file.size <= 2 * 1024 * 1024, {
			message: "Image must be less than 2MB",
		}),
});
type FormData = z.infer<typeof formSchema>;

export function UploadVariantImage({
	variantId,
	fetchVariant,
}: {
	variantId: number;
	fetchVariant: () => Promise<void>;
}) {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [image, setImage] = useState<File | null>(null);

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		clearErrors,
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const onDrop = (acceptedFiles: File[]) => {
		clearErrors("image");

		const file = acceptedFiles[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			return;
		}

		setImage(file);
		setValue("image", file, { shouldValidate: true });
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
		maxSize: 2 * 1024 * 1024,
	});

	const onSubmit = async (data: FormData) => {
		const formData = new FormData();
		formData.append("image", data.image);

		requestHandler(
			async () => uploadVariantImageAPI(variantId, formData),
			setLoading,
			async () => {
				setOpen(false);
				setImage(null);
				await fetchVariant();

				toast.success("Image uploaded successfully.");
			},
			(e) => toast.error(e)
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				if (open) {
					setImage(null);
					reset();
				}
				setOpen(!open);
			}}
		>
			<DialogTrigger asChild>
				<div className="w-[130px] h-[150px] flex-shrink-0 flex items-center justify-center rounded bg-secondary/50 cursor-pointer">
					<IconPlus className="w-6 h-6 text-muted-foreground" />
				</div>
			</DialogTrigger>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add Variant Image</DialogTitle>
					<DialogDescription>
						Upload a variant image and click create.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Label>Image</Label>
						<div
							{...getRootProps()}
							className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
						>
							<input
								id="image"
								{...getInputProps()}
							/>
							<p className="text-sm text-muted-foreground">
								Drag & drop 1 image here, or click to select (Max: 2MB)
							</p>
						</div>

						{/* Validation error */}
						{errors.image && (
							<p className="text-sm text-red-500">{errors.image.message}</p>
						)}
					</div>

					{/* Preview */}
					{image && (
						<div className="mt-3">
							<Image
								src={URL.createObjectURL(image)}
								alt="Preview"
								width={100}
								height={100}
								className="object-cover rounded"
							/>
						</div>
					)}

					<DialogFooter className="mt-4">
						<Button
							type="submit"
							disabled={loading}
							isLoading={loading}
						>
							Upload Variant Image
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
