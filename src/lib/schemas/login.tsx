import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.nonempty("Email is required")
		.trim()
		.email("Please provide a valid email address."), // Email format validation

	password: z
		.string()
		.nonempty("Password is required")
		.trim()
		.min(8, "Password must be at least 8 characters")
		.max(25, "Password cannot be more than 25 characters long."),
});
