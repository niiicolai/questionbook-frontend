import template from './create.html';

export default function createPage() {
    document.getElementById('page').innerHTML = template;

    document.getElementById('create-group-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const response = await fetch('http://localhost:3000/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
            alert('Group created successfully');
        } else {
            alert('Failed to create group');
        }
    });
}
