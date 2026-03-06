import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
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
export const searchShutterstock = (query, page) => api.get('/stock/shutterstock', { params: { query, page } });

export default api;
