import template from './show.html?raw';
import questionListItemTemplate from '../questions/partials/_questionListItem.html?raw';
import memberListItemTemplate from '../groupUsers/partials/_groupUserListItem.html?raw';
import Paginator from '../../utils/paginator.js';
import api from '../../sdks/api/main.js';
import TokenManager from '../../utils/tokenManager.js';
import createToast from '../../toast/toast.js';
import InputSanitizer from '../../utils/inputSanitizer.js';

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

const questionPaginator = new Paginator({
    requestMethod: requestMethod({
        method: async (o) => await api.question.findAll({ ...o, groupId }),
        outputId: 'questions',
        pgPrefix: 'pg-question',
        listTemplate: questionListItemTemplate,
        onEmpty: () => {
            document.getElementById('questions').innerHTML = '<p>No questions found</p>';
        },
        onItem: (div, row) => {
            div.querySelector('.question-title').textContent = inputSanitizer.clean(row.title);
            div.querySelector('.question-user').textContent = row.username;
            div.querySelector('.question-created-at').textContent = new Date(row.createdAt).toLocaleString();
            div.querySelector('.question-updated-at').textContent = new Date(row.updatedAt).toLocaleString();
            div.querySelector('.question-view-link').href = `/question/${row.id}`;
        }
    }),
    limit: 10,
    page: 1,
});

const memberPaginator = new Paginator({
    requestMethod: requestMethod({
        method: (o) => api.groupUser.findAll({ ...o, groupId }),
        outputId: 'members',
        pgPrefix: 'pg-member',
        listTemplate: memberListItemTemplate,
        onEmpty: () => {
            document.getElementById('members').innerHTML = '<p>No members found</p>';
        },
        onItem: (div, row) => {
            div.querySelector('.member-username').textContent = row.username;
            div.querySelector('.member-role-name').textContent = row.roleName;
        }
    }),
    limit: 10,
    page: 1,
});

const deleteGroup = async () => {
    const response = await api.group.delete(groupId);
    if (response.status === 204) {
        window.location.href = '/groups';
    } else {
        createToast({ message: 'Failed to delete group', type: 'error', duration: 3000 });
    }
}

const joinGroup = async () => {
    const response = await api.groupUser.create({ groupId });
    if (response.status === 200) {
        window.location.reload();
    } else {
        createToast({ message: 'Failed to join group', type: 'error', duration: 3000 });
    }
}

const leaveGroup = async () => {
    const response = await api.groupUser.delete(groupId);

    if (response.status === 204) {
        window.location.reload();
    } else {
        const data = await response.json();
        createToast({ message: data, type: 'error', duration: 3000 });
    }
}

export default async function createPage() {
    document.getElementById('page').innerHTML = template;

    groupId = window.location.pathname.split('/').pop();
    const { group, owner } = await api.group.find(groupId);
    const imageBase64 = await api.image.find(group.coverUrl);

    const { hasPermission: bypass } = await api.user.hasGlobalPermissions('group:bypass:membership');
    const tokenManager = new TokenManager();
    let isOwner = false;
    if (tokenManager.hasToken()) {
        const parsedToken = tokenManager.parseToken();
        userId = parsedToken.sub;
        isOwner = userId === owner.id;
        if (isOwner || bypass) {
            document.getElementById('delete-group-btn').addEventListener('click', () => deleteGroup(groupId));
            document.getElementById('edit-group-link').href = `/group/${group.id}/edit`;
            document.getElementById('group-actions').classList.remove('hidden');
        }
    }

    if (userId) {
        const { isMember } = await api.group.isMember(groupId);        

        const showJoinBtn = (!isMember && !isOwner);
        const showLeaveBtn = (isMember && !isOwner);
        console.log({ showJoinBtn, showLeaveBtn, isMember, bypass });
        if (showJoinBtn) {
            const joinBtn = document.getElementById('join-group-btn');
            joinBtn.classList.toggle('hidden', !showJoinBtn);
            joinBtn.addEventListener('click', joinGroup);
        }

        if (showLeaveBtn) {
            const leaveBtn = document.getElementById('leave-group-btn');
            leaveBtn.classList.toggle('hidden', !showLeaveBtn);
            leaveBtn.addEventListener('click', leaveGroup);
        }

        const showQuestionLink = isMember || bypass;
        const createQuestionLink = document.getElementById('create-question-link');
        createQuestionLink.href = `/questions/create?groupId=${groupId}`;
        createQuestionLink.classList.toggle('hidden', !showQuestionLink);
    }

    document.getElementById('group-cover-image').src = imageBase64;
    document.getElementById('group-name').innerText = inputSanitizer.clean(group.name);
    document.getElementById('group-description').innerText = inputSanitizer.clean(group.description);
    document.getElementById('is-private-badge').classList.toggle('hidden', !group.isPrivate);

    questionPaginator.fetch();
    memberPaginator.fetch();
}
