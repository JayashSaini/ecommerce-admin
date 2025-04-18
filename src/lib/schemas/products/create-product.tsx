import { z } from "zod";

export const createProductSchema = z.object({
	name: z
		.string()
		.trim()
		.nonempty("Product name is required")
		.min(3, "Product name must be at least 3 characters long.")
		.max(100, "Product name cannot exceed 100 characters."),

	description: z
		.string({
			required_error: "Product description is required",
			invalid_type_error: "Description must be a string",
		})
		.trim()
		.nonempty("Product description is required")
		.min(3, "Description name must be at least 3 characters long.")
		.max(500, "Description cannot exceed 500 characters."),

	basePrice: z.coerce
		.number({
			required_error: "Base price is required",
			invalid_type_error: "Base price must be a number",
		})
		.nonnegative("Base price cannot be negative")
		.min(99, "Base price must be minimum 99")
		.max(999999, "Base price cannot exceed 999,999."), // Adjust the max limit as needed

	categoryId: z.coerce.number({
		required_error: "Category  is required",
		invalid_type_error: "Please enter a valid category",
	}),

	images: z
		.array(
			z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
				message: "Each image must be 2MB or less",
			})
		)
		.nonempty("At least one image is required")
		.max(4, "Maximum of 4 images allowed"),
});

export const editProductSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "Product name must be at least 3 characters long.")
		.max(100, "Product name cannot exceed 100 characters.")
		.nullable(), // This makes the field nullable, i.e., it can be null or a valid string.

	description: z
		.string()
		.trim()
		.min(3, "Description must be at least 3 characters long.")
		.max(500, "Description cannot exceed 500 characters.")
		.nullable(), // Nullable description

	basePrice: z.coerce
		.number()
		.nonnegative("Base price cannot be negative")
		.min(99, "Base price must be minimum 99")
		.max(999999, "Base price cannot exceed 999,999.")
		.nullable(), // Nullable basePrice

	categoryId: z.coerce.number().nullable(), // Nullable categoryId

	images: z
		.array(
			z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
				message: "Each image must be 2MB or less",
			})
		)
		.max(4, "Maximum of 4 images allowed")
		.nullable(), // Nullable images array
});
