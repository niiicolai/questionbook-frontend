import template from './edit.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';
import { v4 as uuidv4 } from 'uuid';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('edit-comment-form');
    const commentId = window.location.pathname.split('/')[2];
    if (isNaN(commentId)) {
        createToast({ message: 'Comment id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const comment = await api.comment.find(commentId);
    if (!comment) {
        createToast({ message: 'Comment not found', type: 'error', duration: 3000 });
        return;
    }

    const answer = await api.answer.find(comment.answerId);
    if (!answer) {
        createToast({ message: 'Answer not found', type: 'error', duration: 3000 });
        return;
    }

    form.description.value = comment.description;
    document.getElementById('answer-description').textContent = answer.description;
    document.getElementById('back-link').href = '/answer/' + comment.answerId;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const description = formData.get('description');

        try {
            const params = {};
            if (description !== comment.description) params.description = description;
            const response = await api.comment.update(commentId, params);
            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/answer/' + comment.answerId;
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
