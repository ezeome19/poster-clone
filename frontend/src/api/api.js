import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createOrder = (data) => api.post('/orders/checkout', data);
export const verifyOrder = (data) => api.post('/orders/verify', data);

export default api;
