import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { stockApi } from './api';
import { stockKeys } from './keys';
import { StockMovement } from './types';

export function useStockMovementsQuery(
  options?: Omit<UseQueryOptions<StockMovement[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stockKeys.lists(),
    queryFn: () => stockApi.getStockMovements(),
    ...options,
  });
}
