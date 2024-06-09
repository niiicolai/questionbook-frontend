import Navigo from 'navigo';

import createGroup from './pages/groups/create.js';
import editGroup from './pages/groups/edit.js';
import indexGroup from './pages/groups/index.js';
import showGroup from './pages/groups/show.js';
import userGroups from './pages/groups/userGroups.js';

import createQuestion from './pages/questions/create.js';
import editQuestion from './pages/questions/edit.js';
import showQuestion from './pages/questions/show.js';

import createAnswer from './pages/answers/create.js';
import editAnswer from './pages/answers/edit.js';
import showAnswer from './pages/answers/show.js';

import createComment from './pages/comments/create.js';
import editComment from './pages/comments/edit.js';
import deleteComment from './pages/comments/delete.js';

import createUser from './pages/users/create.js';
import editUser from './pages/users/edit.js';

import login from './pages/auth/login.js';
import logout from './pages/auth/logout.js';

import home from './pages/home/index.js';

const router = new Navigo('/', { hash: true });

router.on('/', home);
router.on('/login', login);
router.on('/logout', logout);

router.on('/groups', indexGroup);
router.on('/groups/create', createGroup);
router.on('/group/:id/edit', editGroup);
router.on('/group/:id', showGroup);
router.on('/user/groups', userGroups);

router.on('/questions/create', createQuestion);
router.on('/question/:id/edit', editQuestion);
router.on('/question/:id', showQuestion);

router.on('/answers/create', createAnswer);
router.on('/answer/:id/edit', editAnswer);
router.on('/answer/:id', showAnswer);

router.on('/comments/create', createComment);
router.on('/comment/:id/edit', editComment);
router.on('/comment/:id/delete', deleteComment);

router.on('/users/create', createUser);
router.on('/user/edit', editUser);

router.resolve();

export default router;
