import template from './edit.html?raw';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';
import { v4 as uuidv4 } from 'uuid';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('edit-group-form');
    const groupId = window.location.pathname.split('/')[2];
    if (isNaN(groupId)) {
        createToast({ message: 'Group id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const { group } = await api.group.find(groupId);
    if (!group) {
        createToast({ message: 'Group not found', type: 'error', duration: 3000 });
        return;
    }
    form.name.value = group.name;
    form.description.value = group.description;
    document.getElementById('isPrivate').checked = group.isPrivate;

    const image = await api.image.find(group.coverUrl);
    document.getElementById('cover-image').src = image;

    document.getElementById('back-link').href = '/group/' + groupId;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const description = formData.get('description');
        const file = formData.get('file');
        const isPrivate = formData.get('isPrivate') === 'on';

        try {
            // Upload image
            let coverUrl;
            if (file.size > 0) {
                const imageFormData = new FormData();
                imageFormData.append('file', file);
                imageFormData.append('uuid', uuidv4());
                imageFormData.append('type', 'group-cover-image');
                const imageResponse = await api.image.put(imageFormData);
                const image = await imageResponse.json();
                coverUrl = image.filename;
            }

            // Create group
            const params = {};
            if (name !== group.name) params.name = name;
            if (description !== group.description) params.description = description;
            if (coverUrl) params.coverUrl = coverUrl;
            if (isPrivate !== group.isPrivate) params.isPrivate = isPrivate;
            const groupResponse = await api.group.update(groupId, params);
            const data = await groupResponse.json();

            if (groupResponse.status === 200) {
                window.location.href = '/group/' + data.id;
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
