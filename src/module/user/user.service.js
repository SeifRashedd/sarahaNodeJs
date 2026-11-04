import jwt from "jsonwebtoken";
import { UserModel } from "../../database/models/index.js"
import { verifyToken } from "../../common/security/index.js";



export const profile = async (token) => {
    // let { sub } = jwt.verify(token, configService.jwtSecret)

    let { sub } = verifyToken({ token })
    let user = await UserModel.findById(sub)
    return user
}