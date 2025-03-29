"use client";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	const onClickHandler = () => {
		router.push("/login");
	};
	return (
		<div className="grid min-h-svh">
			<div className="w-full flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a
						href="http://localhost:3000"
						className="flex items-center gap-2 font-medium"
						target="_blank"
					>
						<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						SLYIX APPAREL
					</a>
				</div>
				<div className="w-full flex flex-1 items-center flex-col justify-center text-center">
					<h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl md:text-4xl lg:text-6xl font-sans py-2 md:py-6 relative z-20 font-bold tracking-tight">
						SLYIX ADMIN DASHBOARD
					</h2>
					<p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base uppercase tracking-wide font-semibold">
						Your Centralized eCommerce Control Hub
					</p>
					<p className="max-w-lg text-sm md:text-lg text-neutral-700 dark:text-neutral-400 mt-2">
						Seamlessly manage orders, track inventory, analyze sales trends, and
						enhance customer experience—all from one powerful dashboard.
					</p>
					<Button
						variant={"secondary"}
						className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
						onClick={onClickHandler}
					>
						Login to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
