import api from '../../sdks/api/main.js';
import createToast from '../../toast/toast.js';

export default async function deleteComment() {
    const commentId = window.location.pathname.split('/')[2];
    if (isNaN(commentId)) {
        createToast({ message: 'Comment id must be a number', type: 'error', duration: 3000 });
        return;
    }
    const comment = await api.comment.find(commentId);
    if (!comment) {
        createToast({ message: 'Comment not found', type: 'error', duration: 3000 });
        return;
    }

    try {
        await api.comment.delete(commentId);
        window.location.href = '/answer/' + comment.answerId;
    } catch (error) {
        createToast({ message: error, type: 'error', duration: 3000 });
        console.error(error);
    }
}
