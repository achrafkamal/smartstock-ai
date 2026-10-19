import { Product } from '../products/types';
import { User } from '../auth/types';

export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'DAMAGED';

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string | null;
  productId: string;
  userId: string | null;
  createdAt: string;
  updatedAt?: string;
  product?: Product;
  user?: Partial<User>;
}

export interface CreateStockMovementDto {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  userId?: string;
}
