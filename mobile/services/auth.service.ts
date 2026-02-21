import { apiRequest } from './api';

export const authService = {
  login: (credentials: any) => 
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    
  register: (data: any) => 
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    
  getProfile: () => apiRequest('/users/profile'),
  
  uploadAvatar: async (formData: FormData) => {
    return apiRequest('/uploads', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProfile: (data: any) => 
    apiRequest('/users/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  
};