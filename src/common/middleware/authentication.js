import { UserModel } from "../../database/models/index.js"
import { exception, tokenTypeEnum } from "../index.js";
import { verifyToken } from "../security/jwt.js";
import configService from "../../config/config.service.js";



export const auth = ({ tokenType = tokenTypeEnum.ACCESS } = {}) => {
    return async (req, res, next) => {
        let token = req.headers.authorization;
        if (!token) {
            exception.unAuthorizedException({ message: "Token not provided" })

        }
        let payload = verifyToken({ token, tokenType })
        req.user = await UserModel.findById(payload.sub)
        req.payload = payload
        next()

    }
}
