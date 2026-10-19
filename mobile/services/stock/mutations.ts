import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { stockApi } from './api';
import { stockKeys } from './keys';
import { CreateStockMovementDto, StockMovement } from './types';
import { productKeys } from '../products/keys';

export function useCreateStockMovementMutation(
  options?: UseMutationOptions<StockMovement, Error, CreateStockMovementDto>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (movementData: CreateStockMovementDto) =>
      stockApi.createStockMovement(movementData),
    onSuccess: (...args) => {
      // Invalidate both stock movements and affected products
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      if (args[1]?.productId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.detail(args[1].productId),
        });
      }
      options?.onSuccess?.(...args);
    },
  });
}
