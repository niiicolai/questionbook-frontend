import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find a role by name
     * @param {string} name
     * @returns {Promise}
     * @async
     * @throws {Error} name is required
     */
    find: async function (name) {
        if (!name) throw new Error('name is required');

        const req = new Request({ path: `/role/${name}` });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all roles
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

        const req = new Request({ path: `/roles?limit=${limit}&page=${page}` });
        return await req.get();
    },
};
