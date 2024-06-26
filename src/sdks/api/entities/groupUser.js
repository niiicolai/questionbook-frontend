import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find a group user by id
     * @param {string} id
     * @param {string} groupId - optional
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    find: async function (id, groupId=null) {
        if (!id) throw new Error('id is required');
        let path = `/group_user/${id}`;
        if (groupId) path += `?groupId=${groupId}`;
        const req = new Request({ 
            path,
            useSoftAuth: true, 
        });
        return await req.get();
    },

    /**
     * @function findAll
     * @description Find all group users
     * @param {Object} options
     * @param {number} options.limit
     * @param {number} options.page
     * @param {string} options.groupId - optional
     * @param {string} options.userId - optional
     * @returns {Promise}
     * @async
     * @throws {Error} limit must be a number and greater than 0
     * @throws {Error} page must be a number and greater than 0
     */
    findAll: async function (options={}) {
        const { limit, page, groupId, userId } = options;
        if (isNaN(limit) || limit < 1) 
            throw new Error('limit must be a number and greater than 0');
        if (isNaN(page) || page < 1)
            throw new Error('page must be a number and greater than 0');
        let path = `/group_users?limit=${limit}&page=${page}`;
        if (groupId) path += `&groupId=${groupId}`;
        if (userId) path += `&userId=${userId}`;
        const req = new Request({ 
            path,
            useSoftAuth: true, 
        });
        return await req.get();
    },

    /**
     * @function create
     * @description Create a group user
     * @param {Object} data
     * @param {string} data.groupId
     * @param {string} data.userId
     * @returns {Promise}
     * @async
     * @throws {Error} data is required
     * @throws {Error} groupId is required
     * @throws {Error} userId is required
     */
    create: async function (data) {
        if (!data) throw new Error('data is required');
        if (!data.groupId) throw new Error('groupId is required');

        const req = new Request({ 
            path: `/group_users`,
            useAuth: true,
            useCsrf: true,
            parseJson: false, 
        });
        return await req.post(data);
    },

    /**
     * @function delete
     * @description Delete a group user
     * @param {string} groupId
     * @returns {Promise}
     * @async
     * @throws {Error} id is required
     */
    delete: async function (groupId) {
        if (!groupId) throw new Error('groupId is required');

        const req = new Request({ 
            path: `/group_user/${groupId}`,
            parseJson: false,
            useAuth: true,
            useCsrf: true, 
        });
        return await req.delete();
    },
};
