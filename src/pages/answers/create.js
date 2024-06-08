import template from './create.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('create-answer-form');
    const urlQuery = new URLSearchParams(window.location.search);
    let questionId = urlQuery.get('questionId');
    if (!questionId) {
        createToast({ message: 'Question id is required', type: 'error', duration: 3000 });
        return;
    }
    questionId = parseInt(questionId);

    const question = await api.question.find(questionId);
    if (!question) {
        createToast({ message: 'Question not found', type: 'error', duration: 3000 });
        return;
    }
    
    document.getElementById('question-title').textContent = question.title;
    document.getElementById('back-link').href = '/question/' + questionId;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const description = formData.get('description');

        if (!description) {
            createToast({ message: 'Description is required', type: 'error', duration: 3000 });
            return;
        }

        try {
            const response = await api.answer.create({ 
                description, 
                questionId
            });
            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/answer/' + data.id;
            } else {
                createToast({ message: data, type: 'error', duration: 3000 });
            }
        } catch (error) {
            createToast({ message: error, type: 'error', duration: 3000 });
            console.error(error);
        }
    });
}
