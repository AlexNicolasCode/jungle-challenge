import axios from "axios";

import { getAccessToken } from "../../shared/utils";

export const taskApiClient = axios.create({
    baseURL: 'http://localhost:3000/api/tasks',
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
})