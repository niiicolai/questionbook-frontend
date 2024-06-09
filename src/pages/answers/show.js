import template from './show.html?raw';
import commentListItemTemplate from '../comments/partials/_commentListItem.html?raw';
import Paginator from '../../utils/paginator.js';
import api from '../../sdks/api/main.js';
import TokenManager from '../../utils/tokenManager.js';
import createToast from '../../toast/toast.js';
import InputSanitizer from '../../utils/inputSanitizer.js';

let questionId;
let answerId;
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
        method: (o) => api.comment.findAll({ ...o, answerId }),
        outputId: 'comments',
        pgPrefix: 'pg',
        listTemplate: commentListItemTemplate,
        onEmpty: () => {
            document.getElementById('comments').innerHTML = '<p>No comments found</p>';
        },
        onItem: (div, row) => {
            div.querySelector('.comment-description').textContent = inputSanitizer.clean(row.description);
            div.querySelector('.comment-created-at').textContent = new Date(row.createdAt).toLocaleString();
            div.querySelector('.comment-updated-at').textContent = new Date(row.updatedAt).toLocaleString();
            div.querySelector('.comment-user').textContent = row.username;
            div.querySelector('.comment-edit-link').href = `/comment/${row.id}/edit`;
            div.querySelector('.comment-delete-link').href = `/comment/${row.id}/delete`;
            div.querySelector('.comment-actions').classList.toggle('hidden', userId !== row.userId);
        }
    }),
    limit: 10,
    page: 1,
});

const deleteAnswer = async () => {
    const response = await api.answer.delete(answerId);
    if (response.status === 204) {
        window.location.href = '/question/' + questionId;
    } else {
        createToast({ message: 'Failed to delete answer', type: 'error', duration: 3000 });
    }
}

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    answerId = window.location.pathname.split('/').pop();
    if (isNaN(answerId)) {
        createToast({ message: 'Answer id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const answer = await api.answer.find(answerId);
    if (!answer) {
        createToast({ message: 'Answer not found', type: 'error', duration: 3000 });
        return;
    }

    questionId = answer.questionId;

    document.getElementById('answer-description').innerText = inputSanitizer.clean(answer.description);
    document.getElementById('answer-user').innerText = inputSanitizer.clean(answer.username);
    document.getElementById('answer-created-at').innerText = new Date(answer.createdAt).toLocaleString();
    document.getElementById('answer-updated-at').innerText = new Date(answer.updatedAt).toLocaleString();
    document.getElementById('to-question-link').href = `/question/${answer.questionId}`;

    const question = await api.question.find(answer.questionId);
    groupId = question.groupId;
    const { group, owner } = await api.group.find(groupId);

    const tokenManager = new TokenManager();
    let isOwner = false;
    if (tokenManager.hasToken()) {
        const parsedToken = tokenManager.parseToken();
        userId = parsedToken.sub;
        isOwner = userId === answer.userId;
        if (isOwner) {
            document.getElementById('delete-answer-btn').addEventListener('click', () => deleteAnswer(questionId));
            document.getElementById('edit-answer-link').href = `/answer/${answer.id}/edit`;
            document.getElementById('edit-answer-link').classList.remove('hidden');
            document.getElementById('delete-answer-btn').classList.remove('hidden');
        }
    }

    if (userId) {
        const { isMember } = await api.group.isMember(groupId);

        document.getElementById('create-comment-link').classList.toggle('hidden', !isMember);
        document.getElementById('create-comment-link').href = `/comments/create?answerId=${answerId}`;
    }

    answerPaginator.fetch();
}
