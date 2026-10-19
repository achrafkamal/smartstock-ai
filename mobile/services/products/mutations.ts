import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { productApi } from './api';
import { productKeys } from './keys';
import { CreateProductDto, Product, UpdateProductDto } from './types';

export function useCreateProductMutation(
  options?: UseMutationOptions<Product, Error, CreateProductDto>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateProductDto) => productApi.createProduct(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateProductMutation(
  options?: UseMutationOptions<Product, Error, { id: string; data: UpdateProductDto }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productApi.updateProduct(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(args[1].id) });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteProductMutation(
  options?: UseMutationOptions<{ success: boolean }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(args[1]) });
      options?.onSuccess?.(...args);
    },
  });
}
