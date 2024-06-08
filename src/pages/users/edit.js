import template from './edit.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';
import TokenManager from '../../utils/tokenManager.js';

const tokenManager = new TokenManager();

export default async function createPage() {
    if (!tokenManager.hasToken()) {
        createToast({ message: 'You must be logged in to access this page', type: 'error', duration: 3000 });
        return;
    }

    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('edit-user-form');
    const userId = tokenManager.parseToken().sub;
    const user = await api.user.find(userId);
    if (!user) {
        createToast({ message: 'User not found', type: 'error', duration: 3000 });
        return;
    }
    form.username.value = user.username;
    form.email.value = user.email;


    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const currentPassword = formData.get('currentPassword');

        if (!currentPassword) {
            createToast({ message: 'Current password is required', type: 'error', duration: 3000 });
            return;
        }

        const params = {};
        if (username) params.username = username;
        if (email) params.email = email;
        if (password) params.password = password;

        try {
            const response = await api.user.update(params);
            const data = await response.json();

            if (response.status === 200) {
                createToast({ message: 'User updated', type: 'success', duration: 3000 });
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
