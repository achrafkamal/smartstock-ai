import { apiClient } from '../client';
import { CreateStockMovementDto, StockMovement } from './types';

export const stockApi = {
  getStockMovements: async (): Promise<StockMovement[]> => {
    return apiClient.get<StockMovement[]>('/stock');
  },

  createStockMovement: async (movementData: CreateStockMovementDto): Promise<StockMovement> => {
    return apiClient.post<StockMovement>('/stock', movementData);
  },
};
