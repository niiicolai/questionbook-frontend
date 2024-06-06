import TokenManager from '../../utils/tokenManager.js';

const tokenManager = new TokenManager();

export default function logout() {
    if (tokenManager.hasToken()) {
        tokenManager.clearToken();
    }
    
    window.location.href = '/login';
}
