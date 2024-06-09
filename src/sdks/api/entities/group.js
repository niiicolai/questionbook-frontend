import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find a group by id
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/group/${id}`,
            useSoftAuth: true, 
        });
        return await req.get();
    },

    isMember: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/is-member/group/${id}`,
            useAuth: true, 
        });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all public groups
     * @param {Object} options
     * @param {number} options.limit
     * @param {number} options.page
     * @returns {Promise}
     * @async
     * @throws {Error} limit must be a number and greater than 0
     * @throws {Error} page must be a number and greater than 0
     */
    findAll: async function (options={}) {
        const { limit, page } = options;
        if (isNaN(limit) || limit < 1) 
            throw new Error('limit must be a number and greater than 0');
        if (isNaN(page) || page < 1)
            throw new Error('page must be a number and greater than 0');

        const req = new Request({ 
            path: `/groups?limit=${limit}&page=${page}`,
            useSoftAuth: true, 
        });
        return await req.get();
    },

    /**
     * @function findAllUserGroups
     * @description Find all groups for a user
     * @param {Object} options
     * @param {number} options.limit
     * @param {number} options.page
     * @returns {Promise}
     * @async
     * @throws {Error} limit must be a number and greater than 0
     * @throws {Error} page must be a number and greater than 0
     */
    findAllUserGroups: async function (options={}) {
        const { limit, page } = options;
        if (isNaN(limit) || limit < 1) 
            throw new Error('limit must be a number and greater than 0');
        if (isNaN(page) || page < 1)
            throw new Error('page must be a number and greater than 0');

        const req = new Request({ 
            path: `/groups/user?limit=${limit}&page=${page}`,
            useAuth: true, 
        });
        return await req.get();
    },

    /**
     * @function create
     * @description Create a group
     * @param {Object} data
     * @param {string} data.name
     * @param {string} data.description
     * @param {string} data.coverUrl
     * @param {boolean} data.isPrivate
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} name is required
     * @throws {Error} description is required
     * @throws {Error} coverUrl is required
     * @throws {Error} isPrivate must be a boolean
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.name) throw new Error('name is required');
        if (!data.description) throw new Error('description is required');
        if (!data.coverUrl) throw new Error('coverUrl is required');
        if (typeof data.isPrivate !== 'boolean') throw new Error('isPrivate must be a boolean');

        const req = new Request({ 
            path: `/groups`, 
            parseJson: false, 
            useAuth: true,
            useCsrf: true,
        });
        return await req.post(data);
    },

    /**
     * @function update
     * @description Update a group
     * @param {string} id
     * @param {Object} data
     * @param {string} data.name - optional
     * @param {string} data.description - optional
     * @param {string} data.coverUrl - optional
     * @param {string} data.isPrivate - optional
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     * @throws {Error} data is required
     */
    update: async function (id, data) {
        if (!id) throw new Error('id is required');
        if (!data) throw new Error('data is required');

        const req = new Request({ 
            path: `/group/${id}`, 
            parseJson: false, 
            useAuth: true,
            useCsrf: true,
        });
        return await req.patch(data);
    },

    /**
     * @function delete
     * @description Delete a group
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/group/${id}`, 
            parseJson: false, 
            useAuth: true,
            useCsrf: true, 
        });
        return await req.delete();
    },
};
