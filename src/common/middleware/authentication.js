import ur from "../../database/repo/user.repo.js"
import { exception, tokenTypeEnum } from "../index.js";
import { verifyToken } from "../security/jwt.js";



export const auth = ({ tokenType = tokenTypeEnum.ACCESS } = {}) => {
    return async (req, res, next) => {
        let token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            exception.unAuthorizedException({ message: "Token not provided" })

        }
        let payload = await verifyToken({ token, tokenType })
        req.user = await ur.findById({ id: payload.sub })
        req.payload = payload
        next()

    }
}
