import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://emone.ru:4445',
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});

export default instance;
