const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import axios from 'axios';

const app = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

export default app;