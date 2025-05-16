// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "@/lib/utils";
import { ProductImage } from "@/types/app";
import { ParamValue } from "next/dist/server/request/params";

// Create an Axios instance for API requests
const ecomClient = axios.create({
	baseURL: "/ecom/v1",
	withCredentials: true,
	timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
// Add a request interceptor to set the authorization header with user token
ecomClient.interceptors.request.use(
	function (config) {
		// Retrieve user token from local storage
		const token = LocalStorage.get("token");
		// Set authorization header with bearer token
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// API functions for User actions
const getCategoriesAPI = () => {
	return ecomClient.get("/categories");
};

const getProductsAPI = ({ limit = 10, page = 1 } = {}) => {
	return ecomClient.get(`/products?page=${page}&limit=${limit}`);
};

const getProductByIdAPI = (id: string) => {
	return ecomClient.get(`/products/${id}`);
};

const getVariantByIdAPI = (id: string) => {
	return ecomClient.get(`/products/variants/${id}`);
};

const createProductAPI = (formData: FormData) => {
	return ecomClient.post("/products", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProductAPI = (productId: string | 0, data: any) => {
	return ecomClient.patch(`/products/${productId}`, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateVariantAPI = (productId: ParamValue, data: any) => {
	return ecomClient.patch(`/products/variants/${productId}`, data);
};

const uploadProductImageAPI = (id: number, formData: FormData) => {
	return ecomClient.post(`/products/${id}/image`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const updateProductImagesOrderAPI = (id: number, images: ProductImage[]) => {
	return ecomClient.patch(`/products/${id}/image`, {
		newImagesOrder: images,
	});
};

const uploadVariantImageAPI = (id: number, formData: FormData) => {
	return ecomClient.post(`/products/variants/${id}/image`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

const updateVariantImagesOrderAPI = (id: number, images: ProductImage[]) => {
	return ecomClient.patch(`/products/variants/${id}/image`, {
		newImagesOrder: images,
	});
};

const deleteProductAPI = (productId: string | 0) => {
	return ecomClient.delete(`/products/${productId}`);
};

const deleteVariantAPI = (productId: ParamValue) => {
	return ecomClient.delete(`/products/variants/delete/${productId}`);
};

const deleteProductImageAPI = (productId: string, imageKey: string) => {
	return ecomClient.delete(`/products/${productId}/${imageKey}`);
};

const deleteVariantImageAPI = (variantId: ParamValue, imageKey: string) => {
	return ecomClient.delete(`/products/variants/${variantId}/${imageKey}`);
};

const createVariantAPI = (formData: FormData) => {
	return ecomClient.post("/products/variants", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export {
	ecomClient,
	getCategoriesAPI,
	createProductAPI,
	getProductsAPI,
	getProductByIdAPI,
	createVariantAPI,
	getVariantByIdAPI,
	updateProductAPI,
	deleteProductAPI,
	deleteVariantAPI,
	deleteProductImageAPI,
	uploadProductImageAPI,
	deleteVariantImageAPI,
	updateProductImagesOrderAPI,
	uploadVariantImageAPI,
	updateVariantImagesOrderAPI,
	updateVariantAPI,
};
