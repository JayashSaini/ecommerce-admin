export interface NotificationInterface {
	message: string;
	unread: boolean;
}

export interface DashboardState {
	categories: CategoryInterface[];
	paginatedProducts: PaginatedProductsInterface;
}

export interface CategoryInterface {
	id: number;
	name: string;
	description: string;
}

export interface PaginatedProductsInterface {
	limit: number;
	page: number;
	totalPages: number;
	totalProducts: number;
	products: ProductInterface[];
	filters: [];
}

export interface ProductInterface {
	id: number;
	name: string;
	description: string;
	basePrice: string | number; // or number, depending on actual usage
	categoryId: number;
	createdAt: string; // or Date, if you're parsing it
	status: "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED"; // can be expanded based on enum
	images: ProductImage[];
	category?: CategoryInterface;
	size?: string[];
	color?: string;
	material?: string;
	stockQty?: string;
	variants?: VariantInterface;
}

export interface VariantInterface {
	id: number;
	productId: number;
	title: string;
	images: ProductImage[];
	additionalPrice: string;
	size: string[];
	color: string;
	material: string;
	stockQty: string;
	product?: ProductInterface;
}

export interface ProductImage {
	key: string;
	url: string;
}

export enum ProductStateEnum {
	PUBLISHED = "PUBLISHED",
	UNPUBLISHED = "UNPUBLISHED",
	ARCHIVED = "ARCHIVED",
}
