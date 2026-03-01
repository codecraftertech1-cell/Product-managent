import axios from 'axios';
import type { Product, InventoryStat, CashDraw, Sale, SalesStats, BestSeller } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const redirectToRoute = (route: string) => {
  if (window.location.protocol === 'file:') {
    window.location.hash = route;
    return;
  }
  window.location.href = route;
};

// Create axios instance with auth token support
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      redirectToRoute('/login');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  logout: () => 
    api.post('/auth/logout'),
  changePassword: (data: { 
    current_password: string; 
    new_password: string; 
    new_password_confirmation: string 
  }) => 
    api.post('/auth/change-password', data),
  getMe: () => 
    api.get('/auth/me'),
};

export const productAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  search: (query: string) => api.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
  create: async (data: Partial<Product> | FormData) => {
    // Convert FormData to regular object
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((value, key) => {
        obj[key] = value;
      });
      return api.post<Product>('/products', obj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return api.post<Product>('/products', data);
  },
  update: async (id: string, data: Partial<Product> | FormData) => {
    // Convert FormData to regular object for update
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((value, key) => {
        obj[key] = value;
      });
      return api.put<Product>(`/products/${id}`, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return api.put<Product>(`/products/${id}`, data);
  },
  delete: (id: string) => api.delete(`/products/${id}`),
  getStats: () => api.get<InventoryStat>('/products/stats/inventory'),
};

export const cashDrawAPI = {
  getByDate: (date?: string) => {
    const url = date ? `/cashdraw?date=${date}` : '/cashdraw';
    return api.get<CashDraw>(url);
  },
  getHistory: (startDate?: string, endDate?: string) => {
    let url = '/cashdraw/history';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return api.get<CashDraw[]>(url);
  },
  addItem: (data: { date: string; productId: string; productName: string; quantity: number; price: number; return_qty?: number; sold_qty?: number; cost_price?: number }) => {
    return api.post<CashDraw>('/cashdraw/add-item', data);
  },
  removeItem: (data: { date: string; productId: string }) => {
    return api.post<CashDraw>('/cashdraw/remove-item', data);
  },
  updateItem: (data: { date: string; productId: string; quantity: number; price: number; return_qty?: number; sold_qty?: number; cost_price?: number }) => {
    return api.post<CashDraw>('/cashdraw/update-item', data);
  },
  updateField: (data: { date: string; productId: string; field: string; value: number }) => {
    return api.post<CashDraw>('/cashdraw/update-field', data);
  },
  clear: (date: string) => api.delete(`/cashdraw/clear?date=${date}`),
};

export const salesAPI = {
  getSummary: (startDate?: string, endDate?: string) => {
    let url = '/sales/summary';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return api.get<Sale[]>(url);
  },
  getByPeriod: (groupBy: 'day' | 'month' | 'year' = 'month') => {
    return api.get<Sale[]>(`/sales/by-period?groupBy=${groupBy}`);
  },
  syncFromCashDraw: (date: string) => {
    return api.post<Sale>('/sales/sync-from-cashdraw', { date });
  },
  getBestSellers: (limit: number = 10) => {
    return api.get<BestSeller[]>(`/sales/best-sellers?limit=${limit}`);
  },
  getStats: () => api.get<SalesStats>('/sales/stats'),
  create: (data: Partial<Sale>) => api.post<Sale>('/sales', data),
  delete: (id: string) => api.delete(`/sales/${id}`),
};

export const qrCodeAPI = {
  processToCashDraw: (data: { qr_data: string; date?: string; quantity?: number }) => {
    return api.post('/qrcode/process', data);
  },
  processToSale: (data: { qr_data: string; date?: string; quantity?: number }) => {
    return api.post('/qrcode/sale', data);
  },
};

export default api;
