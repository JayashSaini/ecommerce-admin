import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { GalleryVerticalEnd } from "lucide-react";

// Metadata API for setting title and description
export const metadata: Metadata = {
	title: "Login - SLYIX APPAREL",
	description:
		"Login to your SLYIX APPAREL account to explore the latest fashion trends and manage your profile.",
};

export default function LoginPage() {
	return (
		<div className="grid min-h-svh ">
			<div className="flex flex-col gap-4 p-6 md:p-10">
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

				<div className="w-full flex justify-center">
					<div className="w-full max-w-md sm:mt-28 mt-16">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
}
