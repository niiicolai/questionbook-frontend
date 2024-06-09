import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find an answer by id
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/answer/${id}`,
            useSoftAuth: true,  
        });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all answers
     * @param {Object} options
     * @param {number} options.limit
     * @param {number} options.page
     * @param {string} options.questionId
     * @returns {Promise}
     * @async
     * @throws {Error} limit must be a number and greater than 0
     * @throws {Error} page must be a number and greater than 0
     */
    findAll: async function (options={}) {
        const { limit, page, questionId } = options;
        if (isNaN(limit) || limit < 1) 
            throw new Error('limit must be a number and greater than 0');
        if (isNaN(page) || page < 1)
            throw new Error('page must be a number and greater than 0');
        let path = `/answers?limit=${limit}&page=${page}`;
        if (questionId) path += `&questionId=${questionId}`;
        const req = new Request({ 
            path,
            useSoftAuth: true,  
        });
        return await req.get();
    },

    /**
     * @function create
     * @description Create an answer
     * @param {Object} data
     * @param {string} data.description
     * @param {string} data.questionId
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} description is required
     * @throws {Error} questionId is required
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.description) throw new Error('description is required');
        if (!data.questionId) throw new Error('questionId is required');

        const req = new Request({ 
            path: `/answers`,
            useAuth: true,
            parseJson: false,  
            useCsrf: true,
        });
        return await req.post(data);
    },

    /**
     * @function update
     * @description Update an answer
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
            path: `/answer/${id}`,
            useAuth: true,
            parseJson: false,  
            useCsrf: true,  
        });
        return await req.patch(data);
    },

    /**
     * @function delete
     * @description Delete an answer
     * @param {string} id
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (id) {
        if (!id) throw new Error('id is required');

        const req = new Request({ 
            path: `/answer/${id}`,
            useAuth: true,
            parseJson: false,  
            useCsrf: true,  
        });
        return await req.delete();
    },
};
