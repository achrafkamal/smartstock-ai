import { create } from 'zustand';
import { api } from '../services/api';
import { Product } from './productStore';

export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'DAMAGED';

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string | null;
  productId: string;
  userId: string | null;
  createdAt: string;
  product?: Product;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface StockState {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
  fetchMovements: () => Promise<void>;
  createMovement: (data: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason?: string;
  }) => Promise<boolean>;
}

export const useStockStore = create<StockState>((set, get) => ({
  movements: [],
  loading: false,
  error: null,

  fetchMovements: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getStockMovements();
      set({ movements: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors du chargement des mouvements', loading: false });
    }
  },

  createMovement: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.createStockMovement(data);
      await get().fetchMovements();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors de la création du mouvement', loading: false });
      return false;
    }
  },
}));

export default useStockStore;
