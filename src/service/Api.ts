import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = process.env.REACT_APP_API_URL; // Замените на ваш URL API

// Функция для отправки запросов с токеном авторизации
export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерфейс для токена авторизации
export interface AuthToken {
    token: string;
}

// Функция для установки токена авторизации
export const setAuthToken = (token: string | null): void => {
    if (typeof token === "string") {
        localStorage.setItem('authToken', token)
    }
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

interface MyJwtPayload {
    sub: string;
    roles: string;
    approved: boolean;
    iat: number;
    exp: number;
}

export const getUserRole = (): string  => {
    const token = localStorage.getItem('authToken');
    if (!token) return '';

    try {
        // Используйте интерфейс для типизации декодированного токена
        const decodedToken = jwtDecode<MyJwtPayload>(token);
        return decodedToken.roles; // Предполагая, что роль пользователя находится в свойстве roles
    } catch (error) {
        console.error('Failed to decode token:', error);
        return '';
    }

};

export const getUserId = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        // Используйте интерфейс для типизации декодированного токена
        const decodedToken = jwtDecode<MyJwtPayload>(token);
        return decodedToken.sub; // Предполагая, что роль пользователя находится в свойстве roles
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }

};


