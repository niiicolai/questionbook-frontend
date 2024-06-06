import Navigo from 'navigo';

import createGroup from './pages/groups/create.js';
import editGroup from './pages/groups/edit.js';
import indexGroup from './pages/groups/index.js';
import showGroup from './pages/groups/show.js';

import createUser from './pages/users/create.js';
import editUser from './pages/users/edit.js';
import indexUser from './pages/users/index.js';
import showUser from './pages/users/show.js';

import login from './pages/auth/login.js';
import home from './pages/home/index.js';

const router = new Navigo('/', { hash: true });

router.on('/', home);
router.on('/login', login);

router.on('/groups', indexGroup);
router.on('/groups/create', createGroup);
router.on('/group/:id/edit', editGroup);
router.on('/group/:id', showGroup);

router.on('/users', indexUser);
router.on('/users/create', createUser);
router.on('/user/:id/edit', editUser);
router.on('/user/:id', showUser);

router.resolve();

export default router;
