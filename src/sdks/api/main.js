import TokenManager from "../../utils/tokenManager.js";
import { setTokenManager } from "../../utils/request.js";

import group from "./entities/group.js";
import auth from "./entities/auth.js";
import user from "./entities/user.js";
import question from "./entities/question.js";
import answer from "./entities/answer.js";
import comment from "./entities/comment.js";

setTokenManager(new TokenManager());

const api = {
    group,
    auth,
    user,
    question,
    answer,
    comment
};

export default api;
