import axios from 'axios';

export const createClient = (baseURL: string) => {
    const client = axios.create({
        baseURL,
        withCredentials: true,
    });

    return client;
}
