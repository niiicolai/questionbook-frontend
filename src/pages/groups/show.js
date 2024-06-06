import template from './show.html';
import api from '../../sdks/api/main.js';

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const groupId = window.location.pathname.split('/').pop();
    const group = await api.group.find(groupId);

    document.getElementById('group-cover-image').src = group.coverUrl;
    document.getElementById('group-name').innerText = group.name;
    document.getElementById('group-description').innerText = group.description;
}
