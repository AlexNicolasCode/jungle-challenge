import axios from "axios";

export const authApiClient = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
})