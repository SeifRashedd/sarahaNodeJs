import jwt from "jsonwebtoken";
import { UserModel } from "../../database/models/index.js"
import configService from "../../config/config.service.js";


export const profile = async (token) => {
    let { sub } = jwt.verify(token, configService.jwtSecret)
    let user = await UserModel.findById(sub)
    return user
}