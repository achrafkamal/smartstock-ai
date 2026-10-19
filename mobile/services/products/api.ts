import { apiClient } from '../client';
import { CreateProductDto, Product, UpdateProductDto } from './types';

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products');
  },

  getProduct: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  createProduct: async (productData: CreateProductDto): Promise<Product> => {
    return apiClient.post<Product>('/products', productData);
  },

  updateProduct: async (id: string, productData: UpdateProductDto): Promise<Product> => {
    return apiClient.put<Product>(`/products/${id}`, productData);
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/products/${id}`);
  },
};
