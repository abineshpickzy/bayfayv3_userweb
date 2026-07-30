import axios from 'axios';
import AuthUtils from "./utils/AuthUtils";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

instance.interceptors.request.use(
    config => {
        const token = AuthUtils.getToken();
        const refreshToken = AuthUtils.getRefreshToken();
        if (token && config.url !== '/auth/refresh') {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.url === '/auth/refresh' && refreshToken) {
            config.headers.Authorization = `Refresh ${refreshToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

instance.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default instance;
