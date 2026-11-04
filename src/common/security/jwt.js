import jwt from "jsonwebtoken";
import configService from "../../config/config.service.js";



export const createToken = ({ payload = {}, options = {}, secret = configService.jwtSecret }) => {
    return jwt.sign(payload, secret, options)
}


export const verifyToken = ({ token, secret = configService.jwtSecret }) => {
    return jwt.verify(token, secret)
} 