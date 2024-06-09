import layout from './layout.html?raw';
import TokenManager from '../utils/tokenManager.js';

const clone = document.createElement('div');
clone.innerHTML = layout;

const tokenManager = new TokenManager();
if (tokenManager.hasToken()) {
    const liUserGroups = document.createElement('li');
    liUserGroups.innerHTML = '<a href="/user/groups" class="text-blue-500 hover:underline">My Groups</a>';

    const liCreateGroup = document.createElement('li');
    liCreateGroup.innerHTML = '<a href="/groups/create" class="text-blue-500 hover:underline">Create Group</a>';

    const liProfile = document.createElement('li');
    liProfile.innerHTML = '<a href="/user/edit" class="text-blue-500 hover:underline">Edit Profile</a>';
    
    const liLogout = document.createElement('li');
    liLogout.innerHTML = '<a href="/logout" class="text-blue-500 hover:underline">Logout</a>';

    const liUsername = document.createElement('li');
    const parsedToken = tokenManager.parseToken();
    liUsername.innerHTML = `<p class="text-black">Signed in as ${parsedToken.username}</p>`;
    
    clone.querySelector('#navigation').appendChild(liUserGroups);
    clone.querySelector('#navigation').appendChild(liCreateGroup);
    clone.querySelector('#navigation').appendChild(liProfile);
    clone.querySelector('#navigation').appendChild(liLogout);
    clone.querySelector('#navigation').appendChild(liUsername);
}

document.getElementById('app').innerHTML = clone.innerHTML;
