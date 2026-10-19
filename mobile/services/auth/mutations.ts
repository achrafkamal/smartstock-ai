import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { authApi } from './api';
import { authKeys } from './keys';
import { CreateUserDto, LoginCredentials, LoginResponse, User } from './types';

export function useLoginMutation(
  options?: UseMutationOptions<LoginResponse, Error, LoginCredentials>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}

export function useCreateUserMutation(
  options?: UseMutationOptions<User, Error, CreateUserDto>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (userData: CreateUserDto) => authApi.createUser(userData),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
      options?.onSuccess?.(...args);
    },
  });
}
