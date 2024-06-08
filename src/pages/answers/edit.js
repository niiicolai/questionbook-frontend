import template from './edit.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('edit-answer-form');
    const answerId = window.location.pathname.split('/')[2];
    if (isNaN(answerId)) {
        createToast({ message: 'Answer id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const answer = await api.answer.find(answerId);
    if (!answer) {
        createToast({ message: 'Answer not found', type: 'error', duration: 3000 });
        return;
    }
    form.description.value = answer.description;

    document.getElementById('back-link').href = '/question/' + answer.questionId;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const description = formData.get('description');

        try {
            const params = {};
            if (description !== answer.description) params.description = description;
            const response = await api.answer.update(answerId, params);
            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/answer/' + data.id;
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
