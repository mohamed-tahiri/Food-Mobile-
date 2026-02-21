import { apiRequest } from './api';

export const userService = {
  getOrders: () => apiRequest('/orders'),
  
  getOrderDetails: (id: string) => apiRequest(`/orders/${id}`),
  
  createOrder: (orderData: any) => 
    apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    
  toggleFavorite: (id: string) => 
    apiRequest(`/users/favorites/${id}`, { method: 'POST' }),
    
  getFavorites: () => apiRequest('/users/favorites'),
};