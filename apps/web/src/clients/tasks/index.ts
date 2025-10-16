import axios from "axios";

import { authApiClient } from "../auth";
import { getTokens } from "@/shared/utils";


const taskApiClient = axios.create({
        baseURL: 'http://localhost:3000/api/tasks',
    });

taskApiClient.interceptors.request.use(
        (config) => {
            const storagedTokens = getTokens();
            if (!storagedTokens) {
                return config;
            }
            const { accessToken } = storagedTokens;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
    );

taskApiClient.interceptors.response.use(
        (config) => {
            return config;
        },
        async (error) => {
            const statusCode = error.response?.data?.statusCode;
            const isRetry = error.config.headers.retry;
            const isAuthenticatedError = statusCode === 401;
            const storagedTokens = getTokens();
            if (!isAuthenticatedError || !storagedTokens || isRetry) {
                return Promise.reject(error);
            }
            const { refreshToken } = storagedTokens;
            const response = await authApiClient.post('/refresh', { refreshToken });
            const accessToken = response.data.accessToken;
            localStorage.setItem('tokens', JSON.stringify({
                ...response.data,
                refreshToken,
            }))
            window.dispatchEvent(new CustomEvent('storage', {
                detail: {
                    ...response.data,
                    refreshToken,
                }
            }));
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            error.config.headers.retry = `true`;
            return taskApiClient(error.config);
        },
    );

export { taskApiClient };
