import template from './create.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';
import TokenManager from '../../utils/tokenManager.js';

const tokenManager = new TokenManager();

export default function createPage() {
    if (tokenManager.hasToken()) {
        window.location.href = '/';
        return;
    }

    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('create-user-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        if (!username) {
            createToast({ message: 'Username is required', type: 'error', duration: 3000 });
            return;
        }
        
        if (!email) {
            createToast({ message: 'Email is required', type: 'error', duration: 3000 });
            return;
        }

        if (!password) {
            createToast({ message: 'Password is required', type: 'error', duration: 3000 });
            return;
        }

        try {
            const response = await api.user.create({username, email, password});
            const data = await response.json();

            if (response.status === 200) {
                tokenManager.setToken(data.accessToken);
                
                window.location.href = '/';
            } else {
                console.log(data);
                createToast({ message: data, type: 'error', duration: 3000 });
            }
        } catch (error) {
            createToast({ message: error, type: 'error', duration: 3000 });
            console.error(error);
        }
    });
}
