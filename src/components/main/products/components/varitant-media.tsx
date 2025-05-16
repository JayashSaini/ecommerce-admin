import FullscreenImage from "@/components/common/fullscreen-image";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/types/app";
import { UploadVariantImage } from "./dialog/upload-variant-image";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { requestHandler } from "@/lib/utils";
import { updateVariantImagesOrderAPI } from "@/api/ecommerce";

interface SortableImageProps {
	image: ProductImage;
	onDelete: () => void;
}

const SortableImage = ({ image, onDelete }: SortableImageProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: image.key });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 0,
	};

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			initial={{ scale: 1 }}
			animate={{
				scale: isDragging ? 1.05 : 1,
				boxShadow: isDragging
					? "0 10px 20px rgba(0,0,0,0.1)"
					: "0 0 0 rgba(0,0,0,0)",
			}}
			transition={{ duration: 0.2 }}
			className="relative group"
		>
			<FullscreenImage
				alt="product images"
				src={image.key}
				key={image.key}
				width={130}
				height={150}
				className={`rounded-xl flex-shrink-0 transition-all duration-200 ${
					isDragging
						? "ring-2 ring-primary ring-offset-2 cursor-grabbing"
						: "cursor-grab hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
				}`}
				onDelete={onDelete}
			/>
			{isDragging && (
				<div className="absolute inset-0 bg-primary/10 rounded-xl" />
			)}
		</motion.div>
	);
};

const DraggingImage = ({ image }: { image: ProductImage }) => {
	return (
		<motion.div
			initial={{ scale: 1 }}
			animate={{ scale: 1.05 }}
			transition={{ duration: 0.2 }}
			className="relative"
		>
			<FullscreenImage
				alt="variant images"
				src={image.key}
				width={130}
				height={150}
				className="relative ring-2 ring-primary ring-offset-2 cursor-grabbing"
			/>
		</motion.div>
	);
};

export const VariantMedia = ({
	variantId,
	images,
	deleteImages,
	fetchVariant,
}: {
	variantId: number;
	images: ProductImage[];
	deleteImages: (variantId: string, imageKey: string) => void;
	fetchVariant: () => Promise<void>;
}) => {
	const [localImages, setLocalImages] = useState<ProductImage[]>(images);
	const [isReordering, setIsReordering] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (active.id !== over?.id) {
			setLocalImages((items) => {
				const oldIndex = items.findIndex((item) => item.key === active.id);
				const newIndex = items.findIndex((item) => item.key === over?.id);
				setIsReordering(true);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const handleSaveOrder = async () => {
		await requestHandler(
			() => updateVariantImagesOrderAPI(variantId, localImages),
			null,
			async () => {
				await fetchVariant();
				setIsReordering(false);
				toast.success("Variant image order updated successfully.");
			},
			(e) => {
				toast.error(e);
			}
		);
	};

	const activeImage = activeId
		? localImages.find((img) => img.key === activeId)
		: null;

	return (
		<Card className="@container/card col-span-5 md:col-span-2">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="sm:text-md text-base">Media</CardTitle>
				<CardAction>
					<AnimatePresence mode="wait">
						{isReordering && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.2 }}
							>
								<Button
									variant="default"
									size="sm"
									onClick={handleSaveOrder}
									className="px-4 text-xs"
								>
									Save Changes
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				</CardAction>
			</CardHeader>
			<Separator />
			<CardContent className="w-full flex overflow-auto gap-4 py-2">
				<div className="relative w-full flex overflow-auto gap-4">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={localImages.map((img) => img.key)}
							strategy={verticalListSortingStrategy}
						>
							{localImages.map((image) => (
								<SortableImage
									key={image.key}
									image={image}
									onDelete={() => {
										deleteImages(variantId.toString(), image.key);
									}}
								/>
							))}
						</SortableContext>
						<DragOverlay dropAnimation={null}>
							{activeImage ? <DraggingImage image={activeImage} /> : null}
						</DragOverlay>
					</DndContext>

					{localImages.length <= 3 && (
						<UploadVariantImage
							variantId={variantId}
							fetchVariant={fetchVariant}
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
