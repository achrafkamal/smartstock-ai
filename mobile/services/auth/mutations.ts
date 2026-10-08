import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { authApi } from './api';
import { authKeys } from './keys';
import { CreateUserDto, LoginCredentials, LoginResponse, User } from './types';

export function useLoginMutation(
  options?: UseMutationOptions<LoginResponse, Error, LoginCredentials>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

export function useCreateUserMutation(
  options?: UseMutationOptions<User, Error, CreateUserDto>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => authApi.createUser(userData),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
