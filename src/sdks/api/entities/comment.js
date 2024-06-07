import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find a comment by id
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ path: `/comment/${id}` });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all comments
     * @param {Object} options
     * @param {number} options.limit
     * @param {number} options.page
     * @param {string} options.answerId
     * @returns {Promise}
     * @async
     * @throws {Error} limit must be a number and greater than 0
     * @throws {Error} page must be a number and greater than 0
     */
    findAll: async function (options={}) {
        const { limit, page, answerId } = options;
        if (isNaN(limit) || limit < 1) 
            throw new Error('limit must be a number and greater than 0');
        if (isNaN(page) || page < 1)
            throw new Error('page must be a number and greater than 0');
        let path = `/comments?limit=${limit}&page=${page}`;
        if (answerId) path += `&answerId=${answerId}`;
        const req = new Request({ path });
        return await req.get();
    },

    /**
     * @function create
     * @description Create a comment
     * @param {Object} data
     * @param {string} data.description
     * @param {string} data.answerId
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} description is required
     * @throws {Error} answerId is required
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.description) throw new Error('description is required');
        if (!data.answerId) throw new Error('answerId is required');

        const req = new Request({ 
            path: `/comments`,
            useAuth: true,
            credentials: 'include',
            parseJson: false,    
        });
        return await req.post(data);
    },

    /**
     * @function update
     * @description Update a comment
     * @param {string} id
     * @param {Object} data
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
            path: `/comment/${id}`,
            useAuth: true,
            credentials: 'include',
            parseJson: false,   
        });
        return await req.patch(data);
    },

    /**
     * @function delete
     * @description Delete a comment
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/comment/${id}`,
            useAuth: true,
            credentials: 'include',
            parseJson: false,  
        });
        return await req.delete();
    },
};
