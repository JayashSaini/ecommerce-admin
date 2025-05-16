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
		.transform((val) => (val === "" ? undefined : val))
		.optional()
		.refine((val) => val === undefined || val.length >= 3, {
			message: "Product name must be at least 3 characters long.",
		})
		.refine((val) => val === undefined || val.length <= 100, {
			message: "Product name cannot exceed 100 characters.",
		}),

	description: z
		.string()
		.trim()
		.transform((val) => (val === "" ? undefined : val))
		.optional()
		.refine((val) => val === undefined || val.length >= 3, {
			message: "Description must be at least 3 characters long.",
		})
		.refine((val) => val === undefined || val.length <= 500, {
			message: "Description cannot exceed 500 characters.",
		}),
	basePrice: z
		.preprocess((val) => {
			console.log("val is ; ", val);
			if (val === "" || val === null || typeof val === "undefined") {
				console.log("val is asdfasdfas");
				return undefined;
			}

			return Number(val);
		}, z.number().min(99, "Base price must be minimum 99.").max(999999, "Base price cannot exceed 999,999."))
		.optional(),

	categoryId: z
		.preprocess((val) => (val === "" ? undefined : val), z.number())
		.optional(),

	images: z
		.array(
			z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
				message: "Each image must be 2MB or less",
			})
		)
		.max(4, "Maximum of 4 images allowed")
		.optional(),
});

export const createProductVariantSchema = z.object({
	material: z
		.string()
		.trim()
		.nonempty({ message: "Material is required" })
		.max(50, { message: "Material must be at most 50 characters" }),

	color: z
		.string()
		.trim()
		.nonempty({ message: "Color is required" })
		.max(30, { message: "Color must be at most 30 characters" }),

	size: z.string().trim().nonempty({ message: "Size is required" }),

	stockQty: z.coerce
		.number({ invalid_type_error: "Stock quantity must be a number" })
		.int()
		.min(1, { message: "Stock quantity must be at least 1" }),
});
