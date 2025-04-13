// components/FullscreenImage.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react"; // icon library (optional)
import { Button } from "../ui/button";

type FullscreenImageProps = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
};

export default function FullscreenImage({
	src,
	alt,
	width = 400,
	height = 300,
	className,
}: FullscreenImageProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Normal Image */}
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				onClick={() => setIsOpen(true)}
				className={`cursor-pointer rounded ${className}`}
			/>

			{/* Fullscreen Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90 ">
					<Button
						variant={"outline"}
						onClick={() => {
							setIsOpen(false);
							console.log("working");
						}}
						size={"icon"}
						className="absolute top-4 right-4 cursor-pointer "
					>
						<X />
					</Button>

					<Image
						src={src}
						alt={alt}
						fill
						className="object-contain -z-10"
					/>
				</div>
			)}
		</>
	);
}
