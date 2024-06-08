import template from './create.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('create-question-form');
    const urlQuery = new URLSearchParams(window.location.search);
    let groupId = urlQuery.get('groupId');
    if (!groupId) {
        createToast({ message: 'Group id is required', type: 'error', duration: 3000 });
        return;
    }
    groupId = parseInt(groupId);

    const { group } = await api.group.find(groupId);
    if (!group) {
        createToast({ message: 'Group not found', type: 'error', duration: 3000 });
        return;
    }
    
    document.getElementById('group-name').textContent = group.name;
    document.getElementById('back-link').href = '/group/' + groupId;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title');
        const description = formData.get('description');

        if (!title) {
            createToast({ message: 'Title is required', type: 'error', duration: 3000 });
            return;
        }

        if (!description) {
            createToast({ message: 'Description is required', type: 'error', duration: 3000 });
            return;
        }

        try {
            const response = await api.question.create({ 
                title, 
                description, 
                groupId,
            });
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
