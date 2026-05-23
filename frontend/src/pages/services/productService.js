import axios from 'axios';

// A URL base da sua API Django
const API_URL = 'http://localhost:8000/api/products';

export const getFeaturedProducts = () => {
    return axios.get(`${API_URL}/featured/`);
};

export const getCategoryProducts = (categoryName) => {
    return axios.get(`${API_URL}/category/${categoryName}/`);
};