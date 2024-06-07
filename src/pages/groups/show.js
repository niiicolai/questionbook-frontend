import template from './show.html';
import questionListItemTemplate from '../questions/partials/_questionListItem.html';
import Paginator from '../../utils/paginator.js';
import api from '../../sdks/api/main.js';

const fillPaginationDetails = ({ page, pages, count, limit }, prefix) => {
    document.getElementById(prefix + '-page').innerHTML = `Page: ${page}`;
    document.getElementById(prefix + '-pages').innerHTML = `Pages: ${pages}`;
    document.getElementById(prefix + '-limit').innerHTML = `Limit: ${limit}`;
    document.getElementById(prefix + '-total').innerHTML = `Total: ${count}`;
}

const requestMethod = ({method, outputId, pgPrefix, onEmpty, onItem}) => {
    return async (options) => {
        const { rows, count, pages } = await method(options);

        if (rows.length === 0) {
            onEmpty();
            fillPaginationDetails({ page: options.page, pages, count, limit: options.limit }, pgPrefix);
            return { rows, count, pages };
        }

        const clone = document.createElement('div');
        for (const row of rows) {
            const div = document.createElement('div');
            div.innerHTML = questionListItemTemplate;
            onItem(div, row);
            clone.appendChild(div);
        }

        document.getElementById(outputId).innerHTML = clone.innerHTML;
        fillPaginationDetails({ page: options.page, pages, count, limit: options.limit }, pgPrefix);
        
        return { rows, count, pages };
    }
}
const questionPaginator = new Paginator({
    requestMethod: requestMethod({ 
        method: api.question.findAll, 
        outputId: 'questions', 
        pgPrefix: 'pg-question', 
        onEmpty: () => {
            document.getElementById('questions').innerHTML = '<p>No questions found</p>';
        }, 
        onItem: (div, row) => {
            div.querySelector('.question-title').textContent = row.title;
            div.querySelector('.question-view-link').href = `/question/${row.id}`;
        }
    }),
    limit: 10,
    page: 1,
});

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    const groupId = window.location.pathname.split('/').pop();
    const { group, owner } = await api.group.find(groupId);
    const imageBase64 = await api.image.find(group.coverUrl);
    
    document.getElementById('group-cover-image').src = imageBase64;
    document.getElementById('group-name').innerText = group.name;
    document.getElementById('group-description').innerText = group.description;

    questionPaginator.fetch();
}
