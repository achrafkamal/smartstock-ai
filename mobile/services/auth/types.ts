export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
