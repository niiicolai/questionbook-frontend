import Request from "../../../utils/request.js";

export default {
    /**
     * @function login
     * @description Login a user
     * @param {string} email
     * @param {string} password
     * @returns {Promise}
     * @async
     * @throws {Error} email is required
     * @throws {Error} password is required
     */
    login: async function (email, password) {
        if (!email) throw new Error('email is required');
        if (!password) throw new Error('password is required');

        const req = new Request({ path: `/auth` });
        return await req.post({ email, password });
    },
};
