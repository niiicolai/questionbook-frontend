import template from './edit.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('edit-question-form');
    const questionId = window.location.pathname.split('/')[2];
    if (isNaN(questionId)) {
        createToast({ message: 'Questoni id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const question = await api.question.find(questionId);
    if (!question) {
        createToast({ message: 'Question not found', type: 'error', duration: 3000 });
        return;
    }
    form.title.value = question.title;
    form.description.value = question.description;

    const group = await api.group.find(question.groupId);
    document.getElementById('group-name').textContent = group.name;
    document.getElementById('back-link').href = '/question/' + questionId;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title');
        const description = formData.get('description');

        try {
            const params = {};
            if (title !== question.title) params.title = title;
            if (description !== question.description) params.description = description;
            const response = await api.question.update(questionId, params);
            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/question/' + data.id;
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
