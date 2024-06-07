import template from './create.html';
import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';
import { v4 as uuidv4 } from 'uuid';

export default function createPage() {
    document.getElementById('page').innerHTML = template;

    const form = document.getElementById('create-group-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const description = formData.get('description');
        const file = formData.get('file');

        if (!name) {
            createToast({ message: 'Name is required', type: 'error', duration: 3000 });
            return;
        }

        if (!description) {
            createToast({ message: 'Description is required', type: 'error', duration: 3000 });
            return;
        }

        if (file.size === 0) {
            createToast({ message: 'Image is required', type: 'error', duration: 3000 });
            return;
        }

        try {
            // Upload image
            const imageFormData = new FormData();
            imageFormData.append('file', file);
            imageFormData.append('uuid', uuidv4());
            imageFormData.append('type', 'group-cover-image');
            const imageResponse = await api.image.put(imageFormData);
            const image = await imageResponse.json();
            const coverUrl = image.filename;
            
            // Create group
            const groupResponse = await api.group.create({ 
                name, 
                description, 
                coverUrl 
            });
            const data = await groupResponse.json();
            const { group } = data;

            if (groupResponse.status === 200) {
                window.location.href = '/group/' + group.id;
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
