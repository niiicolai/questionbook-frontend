
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

    getHeaders() {
        return {
            Authorization: `Bearer ${this.getToken()}`,
        };
    }
}
