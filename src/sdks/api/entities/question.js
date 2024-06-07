import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find a question by id
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ path: `/question/${id}` });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all questions
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

        const req = new Request({ path: `/questions?limit=${limit}&page=${page}` });
        return await req.get();
    },

    /**
     * @function create
     * @description Create a question
     * @param {Object} data
     * @param {string} data.title
     * @param {string} data.description
     * @param {string} data.groupId
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} title is required
     * @throws {Error} description is required
     * @throws {Error} groupId is required
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.title) throw new Error('title is required');
        if (!data.description) throw new Error('description is required');
        if (!data.groupId) throw new Error('groupId is required');

        const req = new Request({ 
            path: `/questions`,
            useAuth: true,
            credentials: 'include',
            parseJson: false, 
        });
        return await req.post(data);
    },

    /**
     * @function update
     * @description Update a question
     * @param {string} id
     * @param {Object} data
     * @param {string} data.title - optional
     * @param {string} data.description - optional
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     * @throws {Error} data is required
     */
    update: async function (id, data) {
        if (!id) throw new Error('id is required');
        if (!data) throw new Error('data is required');

        const req = new Request({ 
            path: `/question/${id}`,
            useAuth: true,
            credentials: 'include',
            parseJson: false,  
        });
        return await req.patch(data);
    },

    /**
     * @function delete
     * @description Delete a question
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/question/${id}`,
            useAuth: true,
            credentials: 'include',
            parseJson: false,  
        });
        return await req.delete();
    },
};
