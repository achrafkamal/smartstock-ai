import { Platform } from 'react-native';

// Default to localhost for web/iOS and 10.0.2.2 for Android emulator
const DEFAULT_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = json?.error || json?.message || `Request failed (${response.status})`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    return request<{ user: any; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Users
  getUsers: async () => {
    return request<any[]>('/users');
  },

  getUser: async (id: string) => {
    return request<any>(`/users/${id}`);
  },

  createUser: async (userData: any) => {
    return request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Products
  getProducts: async () => {
    return request<any[]>('/products');
  },

  getProduct: async (id: string) => {
    return request<any>(`/products/${id}`);
  },

  createProduct: async (productData: any) => {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id: string, productData: any) => {
    return request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id: string) => {
    return request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Stock movements
  getStockMovements: async () => {
    return request<any[]>('/stock');
  },

  createStockMovement: async (movementData: {
    productId: string;
    type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'DAMAGED';
    quantity: number;
    reason?: string;
    userId?: string;
  }) => {
    return request<any>('/stock', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  },
};

export default api;
