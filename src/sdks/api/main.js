import TokenManager from "../../utils/tokenManager.js";
import { setTokenManager } from "../../utils/request.js";

import group from "./entities/group.js";
import auth from "./entities/auth.js";

setTokenManager(new TokenManager());

const api = {
    group,
    auth
};

export default api;
