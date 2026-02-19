import { apiRequest } from './api';

export const restaurantService = {
  getAll: (params?: string) => apiRequest(`/restaurants${params ? `?${params}` : ''}`),
  
  getDetails: (id: string) => apiRequest(`/restaurants/${id}`),
  
  getMenu: (id: string) => apiRequest(`/restaurants/${id}/menu`),

  getDish: (menuId: string, dishId: string) => apiRequest(`/restaurants/${menuId}/menu/${dishId}/dish`),
  
  getCategories: () => apiRequest('/categories'),
  
  search: (query: string) => apiRequest(`/restaurants/search?q=${query}`),
};