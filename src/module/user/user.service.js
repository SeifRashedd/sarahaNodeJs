import jwt from "jsonwebtoken";
import { UserModel } from "../../database/models/index.js"
import { verifyToken } from "../../common/security/index.js";





export const updateUser = async (token , data) => {
    let { sub } = verifyToken({ token })
    let user = await UserModel.findByIdAndUpdate(sub , data)
    return user
}