import template from './index.html?raw';

export default function createPage() {
    document.getElementById('page').innerHTML = template;
}
