import { UserModel } from "../../database/models/index.js"
import { exception } from "../index.js";
import { verifyToken } from "../security/jwt.js";



export const auth = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
       exception.badRequestException("Token not provided")

    }
    let { sub } = verifyToken({ token })
    req.user = await UserModel.findById(sub)
    next()

}