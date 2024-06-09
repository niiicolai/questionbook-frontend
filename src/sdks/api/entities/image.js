import Request from "../../../utils/request.js";

export default {
    /**
     * @function find
     * @description Find an image by filename
     * @param {string} filename
     * @returns {Promise}
     * @async
     * @throws {Error} filename is required
     */
    find: async function (filename) {
        if (!filename) throw new Error('filename is required');

        const req = new Request({ 
            path: `/image/${filename}`,
            parseJson: false, 
        });
        const response = await req.get();
        const base64 = await response.text();
        const image = `data:image/png;base64,${base64}`;
        return image;
    },

    /**
     * @function put
     * @description Put an image
     * @param {Object} formData
     * @param {string} formData.type
     * @param {string} formData.uuid
     * @param {string} formData.file
     * @returns {Promise}
     * @async
     * @throws {Error} formData must be an instance of FormData
     * @throws {Error} type is required
     * @throws {Error} uuid is required
     * @throws {Error} file is required
     */
    put: async function (formData) {
        if (!(formData instanceof FormData)) throw new Error('formData must be an instance of FormData');
        if (!formData.get('type')) throw new Error('type is required');
        if (!formData.get('uuid')) throw new Error('uuid is required');
        if (!formData.get('file')) throw new Error('file is required');

        const req = new Request({ 
            path: `/images`, 
            useAuth: true, 
            parseJson: false,
            stringifyBody: false,
            useCsrf: true,
        });
        return await req.put(formData);
    },

    /**
     * @function delete
     * @description Delete an image
     * @param {string} filename
     * @returns {Promise}
     * @async
     * @throws {Error} filename is required
     */
    delete: async function (filename) {
        if (!filename) throw new Error('filename is required');

        const req = new Request({ 
            path: `/image/${filename}`, 
            useAuth: true,
            useCsrf: true, 
        });
        return await req.delete();
    },
};
