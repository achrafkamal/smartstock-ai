import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { authApi } from './api';
import { authKeys } from './keys';
import { User } from './types';

export function useUsersQuery(
  options?: Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: authKeys.users(),
    queryFn: () => authApi.getUsers(),
    ...options,
  });
}

export function useUserQuery(
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: authKeys.user(id),
    queryFn: () => authApi.getUser(id),
    enabled: Boolean(id) && (options?.enabled !== false),
    ...options,
  });
}
