export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number;
  quantity: number;
  lowStockThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  quantity?: number;
  lowStockThreshold?: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export type ProductFilterTab = 'ALL' | 'LOW' | 'OUT';
