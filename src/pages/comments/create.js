import template from './create.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('create-comment-form');
    const urlQuery = new URLSearchParams(window.location.search);
    let answerId = urlQuery.get('answerId');
    if (!answerId) {
        createToast({ message: 'Answer id is required', type: 'error', duration: 3000 });
        return;
    }
    answerId = parseInt(answerId);

    const answer = await api.answer.find(answerId);
    if (!answer) {
        createToast({ message: 'Answer not found', type: 'error', duration: 3000 });
        return;
    }
    
    document.getElementById('answer-description').textContent = answer.description;
    document.getElementById('back-link').href = '/answer/' + answerId;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const description = formData.get('description');

        if (!description) {
            createToast({ message: 'Description is required', type: 'error', duration: 3000 });
            return;
        }

        try {
            const response = await api.comment.create({ 
                description, 
                answerId
            });
            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/answer/' + answerId;
            } else {
                createToast({ message: data, type: 'error', duration: 3000 });
            }
        } catch (error) {
            createToast({ message: error, type: 'error', duration: 3000 });
            console.error(error);
        }
    });
}
