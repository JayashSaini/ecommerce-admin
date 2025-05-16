import { z } from "zod";

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
	title: z
		.string()
		.trim()
		.nonempty({ message: "title:  is required" })
		.max(100, { message: "title:  must be at most 100 characters" }),

	size: z.string().trim().nonempty({ message: "Size is required" }),

	stockQty: z.coerce
		.number({ invalid_type_error: "Stock quantity must be a number" })
		.int()
		.min(1, { message: "Stock quantity must be at least 1" }),

	productId: z.coerce
		.number({ invalid_type_error: "Product ID must be a number" })
		.int()
		.positive({ message: "Product ID must be a positive number" }),

	images: z
		.array(
			z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
				message: "Each image must be 2MB or less",
			})
		)
		.nonempty({ message: "At least one image is required" })
		.max(4, { message: "You can upload a maximum of 4 images" }),

	additionalPrice: z.coerce
		.number({ invalid_type_error: "Additional price must be a number" })
		.min(0, { message: "Additional price must be at least 0" })
		.max(99999, { message: "Additional price is too high" }),
});

export const editProductVariantSchema = z.object({
	material: z
		.string()
		.trim()
		.transform((val) => (val === "" ? undefined : val))
		.optional()
		.refine((val) => val === undefined || val.length <= 50, {
			message: "Material must be at most 50 characters",
		}),

	color: z
		.string()
		.trim()
		.transform((val) => (val === "" ? undefined : val))
		.optional()
		.refine((val) => val === undefined || val.length <= 30, {
			message: "Color must be at most 30 characters",
		}),

	title: z
		.string()
		.trim()
		.transform((val) => (val === "" ? undefined : val))
		.optional()
		.refine((val) => val === undefined || val.length <= 100, {
			message: "Title must be at most 100 characters",
		}),

	size: z
		.string()
		.trim()
		.transform((val) => (val === "" ? undefined : val))
		.optional(),

	stockQty: z
		.preprocess((val) => {
			if (val === "" || val === null || typeof val === "undefined") {
				return undefined;
			}
			return Number(val);
		}, z.number().int().min(1, { message: "Stock quantity must be at least 1" }))
		.optional(),

	additionalPrice: z
		.preprocess((val) => {
			if (val === "" || val === null || typeof val === "undefined") {
				return undefined;
			}
			return Number(val);
		}, z.number().min(0, { message: "Additional price must be at least 0" }).max(99999, { message: "Additional price is too high" }))
		.optional(),
});

export enum PRODUCT_SIZE_ENUM {
	XS = "XS",
	S = "S",
	M = "M",
	L = "L",
	XL = "XL",
	XXL = "XXL",
	XXXL = "XXXL",
}
export const AvailableProductSizes = Object.values(PRODUCT_SIZE_ENUM) as [
	string
];
