import { API_BASE_URL, getAuthToken, setAuthToken, apiClient, request } from './client';
import { authApi } from './auth/api';
import { productApi } from './products/api';
import { stockApi } from './stock/api';

export { API_BASE_URL, getAuthToken, setAuthToken, apiClient, request };

export const api = {
  // Authentication & Users
  login: authApi.login,
  getUsers: authApi.getUsers,
  getUser: authApi.getUser,
  createUser: authApi.createUser,

  // Products
  getProducts: productApi.getProducts,
  getProduct: productApi.getProduct,
  createProduct: productApi.createProduct,
  updateProduct: productApi.updateProduct,
  deleteProduct: productApi.deleteProduct,

  // Stock movements
  getStockMovements: stockApi.getStockMovements,
  createStockMovement: stockApi.createStockMovement,
};

export default api;
