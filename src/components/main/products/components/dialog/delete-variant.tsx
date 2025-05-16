"use client";

import { useState } from "react";
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
import { deleteVariantAPI } from "@/api/ecommerce";
import { ParamValue } from "next/dist/server/request/params";

export function DeleteVariantDialog({
	open,
	setOpen,
	id,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: ParamValue;
}) {
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const onSubmit = async () => {
		console.log("Delete variant clicked, id:", id);
		requestHandler(
			async () => {
				console.log("Making delete request for variant:", id);
				return deleteVariantAPI(id);
			},
			setLoading,
			() => {
				console.log("Variant deleted successfully");
				toast.success("Variant deleted successfully");
				router.push("/dashboard/products");
			},
			(error) => {
				console.error("Error deleting variant:", error);
				toast.error(error);
			}
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
					<DialogTitle>Delete Variant</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this variant? This action cannot be
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
