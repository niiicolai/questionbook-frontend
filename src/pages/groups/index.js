import template from './index.html';
import groupListItemTemplate from './partials/_groupListItem.html';
import Paginator from '../../utils/paginator.js';
import api from '../../sdks/api/main.js';

const fillPaginationDetails = ({ page, pages, count, limit }) => {
    document.getElementById('pg-page').innerHTML = `Page: ${page}`;
    document.getElementById('pg-pages').innerHTML = `Pages: ${pages}`;
    document.getElementById('pg-limit').innerHTML = `Limit: ${limit}`;
    document.getElementById('pg-total').innerHTML = `Total: ${count}`;
}

const requestMethod = async (options) => {
    const { rows, count, pages } = await api.group.findAll(options);

    if (rows.length === 0) {
        document.getElementById('groups').innerHTML = '<p>No groups found</p>';
        fillPaginationDetails({ page: options.page, pages, count, limit: options.limit });
        return { rows, count, pages };
    }

    const clone = document.createElement('div');
    for (const row of rows) {
        const div = document.createElement('div');
        div.innerHTML = groupListItemTemplate;
        div.querySelector('.group-name').textContent = row.name;
        div.querySelector('.group-view-link').href = `/group/${row.id}`;
        clone.appendChild(div);
    }
    document.getElementById('groups').innerHTML = clone.innerHTML;
    fillPaginationDetails({ page: options.page, pages, count, limit: options.limit });
    return { rows, count, pages };
}

const paginator = new Paginator({
    requestMethod,
    limit: 10,
    page: 1,
});

export default function createPage() {
    document.getElementById('page').innerHTML = template;
    paginator.fetch();

    document.getElementById('pg-first-page').addEventListener('click', () => paginator.first());
    document.getElementById('pg-previous-page').addEventListener('click', () => paginator.previous());
    document.getElementById('pg-next-page').addEventListener('click', () => paginator.next());
    document.getElementById('pg-last-page').addEventListener('click', () => paginator.last());
}
