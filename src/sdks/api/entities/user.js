import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find an user by id
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ path: `/user/${id}` });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all users
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

        const req = new Request({ path: `/users?limit=${limit}&page=${page}` });
        return await req.get();
    },

    /**
     * @function create
     * @description Create an user
     * @param {Object} data
     * @param {string} data.username
     * @param {string} data.email
     * @param {string} data.password
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} username is required
     * @throws {Error} email is required
     * @throws {Error} password is required
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.username) throw new Error('username is required');
        if (!data.email) throw new Error('email is required');
        if (!data.password) throw new Error('password is required');

        const req = new Request({ path: `/users`, parseJson: false });
        return await req.post(data);
    },

    /**
     * @function update
     * @description Update an user
     * @param {string} id
     * @param {Object} data
     * @param {string} data.username - optional
     * @param {string} data.email - optional
     * @param {string} data.password - optional
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     * @throws {Error} data is required
     */
    update: async function (id, data) {
        if (!id) throw new Error('id is required');
        if (!data) throw new Error('data is required');

        const req = new Request({ path: `/user/${id}` });
        return await req.put(data);
    },

    /**
     * @function delete
     * @description Delete an user
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ path: `/group/${id}` });
        return await req.delete();
    },
};
