import template from './login.html';
import api from '../../sdks/api/main.js';

export default function createGroup() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            const response = await api.auth.login(email, password);
            console.log(response);
            if (response.status === 200) {
                window.location.href = '/home';
            }
        } catch (error) {
            console.error(error);
        }
    });
}

