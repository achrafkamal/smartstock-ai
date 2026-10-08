import { apiClient, setAuthToken } from '../client';
import { CreateUserDto, LoginCredentials, LoginResponse, User } from './types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const data = await apiClient.post<LoginResponse>('/users/login', credentials);
    if (data?.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users');
  },

  getUser: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  createUser: async (userData: CreateUserDto): Promise<User> => {
    return apiClient.post<User>('/users', userData);
  },
};
