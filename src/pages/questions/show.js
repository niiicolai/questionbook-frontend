import template from './show.html';
import answerListItemTemplate from '../answers/partials/_answerListItem.html';
import Paginator from '../../utils/paginator.js';
import api from '../../sdks/api/main.js';
import TokenManager from '../../utils/tokenManager.js';
import createToast from '../../toast/toast.js';
import InputSanitizer from '../../utils/inputSanitizer.js';

let questionId;
let groupId;
let userId;

const inputSanitizer = new InputSanitizer();

const fillPaginationDetails = ({ page, pages, count, limit }, prefix) => {
    document.getElementById(prefix + '-page').innerHTML = `Page: ${page}`;
    document.getElementById(prefix + '-pages').innerHTML = `Pages: ${pages}`;
    document.getElementById(prefix + '-limit').innerHTML = `Limit: ${limit}`;
    document.getElementById(prefix + '-total').innerHTML = `Total: ${count}`;
}

const requestMethod = ({ method, outputId, pgPrefix, listTemplate, onEmpty, onItem }) => {
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
            div.innerHTML = listTemplate;
            onItem(div, row);
            clone.appendChild(div);
        }

        document.getElementById(outputId).innerHTML = clone.innerHTML;
        fillPaginationDetails({ page: options.page, pages, count, limit: options.limit }, pgPrefix);

        return { rows, count, pages };
    }
}

const answerPaginator = new Paginator({
    requestMethod: requestMethod({
        method: (o) => api.answer.findAll({ ...o, questionId }),
        outputId: 'answers',
        pgPrefix: 'pg',
        listTemplate: answerListItemTemplate,
        onEmpty: () => {
            document.getElementById('answers').innerHTML = '<p>No answers found</p>';
        },
        onItem: (div, row) => {
            div.querySelector('.answer-description').textContent = inputSanitizer.clean(row.description);
            div.querySelector('.answer-created-at').textContent = new Date(row.createdAt).toLocaleString();
            div.querySelector('.answer-updated-at').textContent = new Date(row.updatedAt).toLocaleString();
            div.querySelector('.answer-user').textContent = row.username;
            div.querySelector('.answer-view-link').href = `/answer/${row.id}`;
        }
    }),
    limit: 10,
    page: 1,
});

const deleteQuestion = async () => {
    const response = await api.question.delete(questionId);
    if (response.status === 204) {
        window.location.href = '/group/' + groupId;
    } else {
        createToast({ message: 'Failed to delete question', type: 'error', duration: 3000 });
    }
}

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    questionId = window.location.pathname.split('/').pop();
    if (isNaN(questionId)) {
        createToast({ message: 'Question id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const question = await api.question.find(questionId);
    if (!question) {
        createToast({ message: 'Question not found', type: 'error', duration: 3000 });
        return;
    }

    const questionUser = await api.user.find(question.userId);

    document.getElementById('question-title').innerText = inputSanitizer.clean(question.title);
    document.getElementById('question-description').innerText = inputSanitizer.clean(question.description);
    document.getElementById('question-user').innerText = questionUser.username;
    document.getElementById('question-created-at').innerText = new Date(question.createdAt).toLocaleString();
    document.getElementById('question-updated-at').innerText = new Date(question.updatedAt).toLocaleString();
    document.getElementById('to-group-link').href = `/group/${question.groupId}`;

    groupId = question.groupId;
    const { group, owner } = await api.group.find(groupId);

    const tokenManager = new TokenManager();
    let isOwner = false;
    if (tokenManager.hasToken()) {
        const parsedToken = tokenManager.parseToken();
        userId = parsedToken.sub;
        isOwner = userId === question.userId;
        if (isOwner) {
            document.getElementById('delete-question-btn').addEventListener('click', () => deleteQuestion(questionId));
            document.getElementById('edit-question-link').href = `/question/${group.id}/edit`;
            document.getElementById('edit-question-link').classList.remove('hidden');
            document.getElementById('delete-question-btn').classList.remove('hidden');
        }
    }

    if (userId) {
        const { rows } = await api.groupUser.findAll({ limit: 1, page: 1, groupId, userId });
        const isMember = rows.length > 0;

        document.getElementById('create-answer-link').classList.toggle('hidden', !isMember);
        document.getElementById('create-answer-link').href = `/answers/create?questionId=${questionId}`;
    }

    answerPaginator.fetch();
}
