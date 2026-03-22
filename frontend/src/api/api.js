import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
console.log('API Base URL:', API_URL);

const api = axios.create({
    baseURL: API_URL
});

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);

// AI Generation Flow
export const getWhisprFlow = (prompt) => api.post('/ai/whispr-flow', { prompt });
export const getInterviewAgent = (expandedPrompt) => api.post('/ai/interview-agent', { expandedPrompt });
export const generateAI = (prompt, answers, provider) => api.post('/ai/generate', { prompt, answers, provider });

// Stock Media Search
export const searchPexelsImages = (query, page) => api.get('/stock/pexels/images', { params: { query, page } });
export const searchUnsplash = (query, page) => api.get('/stock/unsplash', { params: { query, page } });
export const validateExternalUrl = (url) => api.post('/stock/validate-url', { url });

// Orders & Checkout
export const checkout = (orderData) => api.post('/orders/checkout', orderData);
export const verifyOrder = (verificationData) => api.post('/orders/verify', verificationData);

export const getProxyUrl = (url) => `${API_URL}/stock/proxy?url=${encodeURIComponent(url)}`;

export default api;
