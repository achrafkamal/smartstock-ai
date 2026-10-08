import { create } from 'zustand';
import { api } from '../services/api';

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

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  createProduct: (data: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getProducts();
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors du chargement des produits', loading: false });
    }
  },

  fetchProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const product = await api.getProduct(id);
      set({ selectedProduct: product, loading: false });
      return product;
    } catch (err: any) {
      set({ error: err.message || 'Produit introuvable', loading: false });
      return null;
    }
  },

  createProduct: async (data: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      await api.createProduct(data);
      await get().fetchProducts();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erreur création produit', loading: false });
      return false;
    }
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      await api.updateProduct(id, data);
      await get().fetchProducts();
      if (get().selectedProduct?.id === id) {
        await get().fetchProduct(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erreur mise à jour produit', loading: false });
      return false;
    }
  },
}));

export default useProductStore;
