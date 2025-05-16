"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { requestHandler } from "@/lib/utils";
import { deleteProductAPI } from "@/api/ecommerce";

export function DeleteProductDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const router = useRouter();

	const onSubmit = async () => {
		requestHandler(
			async () => deleteProductAPI(id as string),
			setLoading,
			() => {
				toast.success("Product deleted successfully");
				router.push("/dashboard/products");

				window.location.reload();
			},
			(error) => toast.error(error)
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogOverlay className="fixed inset-0 bg-background/30 backdrop-blur-sm z-40" />
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Delete Product</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this product? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-4 flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						isLoading={loading}
						onClick={onSubmit}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
