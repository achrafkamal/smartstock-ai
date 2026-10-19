import { create } from 'zustand';
import {
  stockApi,
  StockMovement,
  MovementType,
  CreateStockMovementDto,
} from '../services/stock';
import { Product } from '../services/products';

export type { StockMovement, MovementType, Product };

interface StockState {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
  fetchMovements: () => Promise<void>;
  createMovement: (data: CreateStockMovementDto) => Promise<boolean>;
}

export const useStockStore = create<StockState>((set, get) => ({
  movements: [],
  loading: false,
  error: null,

  fetchMovements: async () => {
    set({ loading: true, error: null });
    try {
      const data = await stockApi.getStockMovements();
      set({ movements: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors du chargement des mouvements', loading: false });
    }
  },

  createMovement: async (data: CreateStockMovementDto) => {
    set({ loading: true, error: null });
    try {
      await stockApi.createStockMovement(data);
      await get().fetchMovements();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors de la création du mouvement', loading: false });
      return false;
    }
  },
}));

export default useStockStore;
