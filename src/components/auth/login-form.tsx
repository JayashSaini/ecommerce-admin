"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login as loginHandler } from "@/features/thunk/authThunk";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setLoading(true);
		const result = await dispatch(loginHandler(data));
		setLoading(false);
		// reset the form
		reset();
		if (loginHandler.fulfilled.match(result)) {
			// Redirect to the login page if registration is successful
			router.push("/dashboard");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to Dashboard</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Enter your email below to login to admin dashboard
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="joe@example.com"
						{...register("email")}
						error={errors.email?.message}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="********"
						{...register("password")}
						error={errors.password?.message}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={loading}
					isLoading={loading}
				>
					Login
				</Button>
			</div>
		</form>
	);
}
