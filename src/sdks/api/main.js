import TokenManager from "../../utils/tokenManager.js";
import { setTokenManager } from "../../utils/request.js";

import group from "./entities/group.js";
import auth from "./entities/auth.js";
import user from "./entities/user.js";
import question from "./entities/question.js";
import answer from "./entities/answer.js";
import comment from "./entities/comment.js";
import role from "./entities/role.js";
import permission from "./entities/permission.js";
import groupUser from "./entities/groupUser.js";
import rolePermission from "./entities/rolePermission.js";
import image from "./entities/image.js";

setTokenManager(new TokenManager());

const api = {
    group,
    auth,
    user,
    question,
    answer,
    comment,
    role,
    permission,
    groupUser,
    rolePermission,
    image,
};

export default api;
