import layout from './layout.html';
import TokenManager from '../utils/tokenManager.js';

const clone = document.createElement('div');
clone.innerHTML = layout;

const tokenManager = new TokenManager();
if (tokenManager.hasToken()) {
    const liProfile = document.createElement('li');
    liProfile.innerHTML = '<a href="/profile" class="text-blue-500 hover:underline">Profile</a>';
    
    const liLogout = document.createElement('li');
    liLogout.innerHTML = '<a href="/logout" class="text-blue-500 hover:underline">Logout</a>';

    const liUsername = document.createElement('li');
    const parsedToken = tokenManager.parseToken();
    liUsername.innerHTML = `<p class="text-black">Signed in as ${parsedToken.username}</p>`;
    
    clone.querySelector('#navigation').appendChild(liProfile);
    clone.querySelector('#navigation').appendChild(liLogout);
    clone.querySelector('#navigation').appendChild(liUsername);
}

document.getElementById('app').innerHTML = clone.innerHTML;
