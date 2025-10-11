import axios from "axios";

import { authApiClient } from "../auth";

const taskApiClient = axios.create({
        baseURL: 'http://localhost:3000/api/tasks',
    });

taskApiClient.interceptors.request.use(
        (config) => {
            const storagedTokens = localStorage.getItem('tokens');
            if (!storagedTokens) {
                return config;
            }
            const { accessToken } = JSON.parse(storagedTokens);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        async (error) => {
            const statusCode = error.response?.data?.statusCode;
            const isAuthenticatedError = statusCode === 401;
            const storagedTokens = localStorage.getItem('tokens');
            if (!isAuthenticatedError || !storagedTokens) {
                return Promise.reject(error);
            }
            const { refreshToken } = JSON.parse(storagedTokens);
            const response = await authApiClient.post('/refresh', { refreshToken });
            const accessToken = response.data.accessToken;
            localStorage.setItem('tokens', JSON.stringify({
                ...response.data,
                refreshToken,
            }))
            return taskApiClient.request({
                ...error.config,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
        }
    );

export { taskApiClient };
