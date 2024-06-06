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
    
    clone.querySelector('#navigation').appendChild(liProfile);
    clone.querySelector('#navigation').appendChild(liLogout);
}

document.getElementById('app').innerHTML = clone.innerHTML;
