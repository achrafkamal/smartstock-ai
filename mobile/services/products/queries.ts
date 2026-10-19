import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { productApi } from './api';
import { productKeys } from './keys';
import { Product } from './types';

export function useProductsQuery(
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => productApi.getProducts(),
    ...options,
  });
}

export function useProductQuery(
  id: string,
  options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: Boolean(id) && (options?.enabled !== false),
    ...options,
  });
}
