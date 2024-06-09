
const accessTokenKey = import.meta.env.VITE_ACCESS_TOKEN_KEY;

export default class TokenManager {
    constructor() {
    }

    setToken(token) {
        localStorage.setItem(accessTokenKey, token);
    }

    getToken() {
        return localStorage.getItem(accessTokenKey);
    }

    clearToken() {
        localStorage.removeItem(accessTokenKey);
    }

    hasToken() {
        return !!localStorage.getItem(accessTokenKey);
    }

    parseToken() {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    }

    getAuthHeader() {
        return {
            Authorization: `Bearer ${this.getToken()}`,
        };
    }

    getCsrfHeader() {
        const csrfToken = this.parseToken().csrfToken;
        return {
            'x-csrf-token': csrfToken,
        };
    }
}
