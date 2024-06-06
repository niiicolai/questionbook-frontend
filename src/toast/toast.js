import template from './toast.html';

const typeToCss = {
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
};

export default function createToast(options = {}) {
    if (!options.message) {
        throw new Error('Toast message is required');
    }

    if (!options.type) {
        throw new Error('Toast type is required');
    }

    if (!options.duration) {
        throw new Error('Toast duration is required');
    }

    const clone = document.createElement('div');
    clone.innerHTML = template;

    const typeClassName = typeToCss[options.type];
    typeClassName.split(' ').forEach((className) => {
        clone.querySelector('.toast').classList.add(className);
    });

    clone.querySelector('.toast-message').innerText = options.message;
    clone.querySelector('.toast-close').addEventListener('click', () => {
        clone.querySelector('.toast').remove();
    });

    setTimeout(() => {
        clone.querySelector('.toast').remove();
    }, options.duration);

    document.getElementById('toast-output').appendChild(clone);
}
