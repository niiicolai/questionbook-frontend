
const csrfTokenKey = import.meta.env.VITE_CSRF_TOKEN_KEY;

export default class CsrfManager {
    constructor() {
    }

    getToken() {
        // get csrf token from cookie
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${csrfTokenKey}=`));
        if (!cookie) {
            return null;
        }

        return cookie.split('=')[1];
    }

    getHeaders() {
        return {
            'csrf-token': this.getToken(),
        };
    }
}
