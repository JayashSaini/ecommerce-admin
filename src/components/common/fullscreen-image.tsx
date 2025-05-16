"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconTrash, IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { CDNImage } from "./cdn-image";

type FullscreenImageProps = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	onDelete?: () => void; // optional delete handler
};

export default function FullscreenImage({
	src,
	alt,
	width = 300,
	height = 400,
	className,
	onDelete,
}: FullscreenImageProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Avoid server-side rendering issues with portals
	useEffect(() => {
		setMounted(true);
	}, []);

	const modalContent = (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
			<Button
				variant="outline"
				onClick={() => setIsOpen(false)}
				size="icon"
				className="absolute top-4 right-4 cursor-pointer z-[10000]"
			>
				<IconX />
			</Button>

			<CDNImage
				src={src}
				alt={alt}
				fill
				className="object-contain z-[9999]"
			/>
		</div>
	);

	return (
		<>
			<div
				className={`relative group ${className}`}
				style={{
					width: `${width}px`,
					height: `${height}px`,
					flex: "0 0 auto",
				}}
			>
				<CDNImage
					src={src}
					alt={alt}
					width={width}
					height={height}
					onClick={() => setIsOpen(true)}
					className="cursor-pointer rounded w-full h-full object-cover"
				/>

				{onDelete && (
					<Button
						variant="ghost"
						size="icon"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="absolute top-1 right-1 z-10 text-red-600 hover:text-red-500 hover:dark:bg-transparent hover:bg-transparent opacity-0 group-hover:opacity-100 transition"
					>
						<IconTrash className="w-4 h-4" />
					</Button>
				)}
			</div>

			{/* Fullscreen Modal rendered via Portal */}
			{mounted && isOpen && createPortal(modalContent, document.body)}
		</>
	);
}
