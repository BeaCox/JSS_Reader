import axios from 'axios';

const CATEGORY_BASE_URL = '/api/v1/category/';

export const addCategory = (name) => {
    return axios.post(CATEGORY_BASE_URL, { name });
};

export const getCategories = () => {
    return axios.get(CATEGORY_BASE_URL);
};

export const updateCategory = (name, newname) => {
    return axios.put(CATEGORY_BASE_URL, { name, newname });
};

export const deleteCategory = (name) => {
    return axios.delete(CATEGORY_BASE_URL, { data: { name } });
};
