import jwt from "jsonwebtoken";
import configService from "../../config/config.service.js";
import { tokenTypeEnum } from "../enums/index.js";

export const createTokens = ({ payload = {}, options = {} } = {}) => {
    let accessToken = createToken({
        payload,
        secret: configService.jwt_access_secret,
        options: {
            ...options,
            expiresIn: configService.jwt_access_exp
        }
    })

    let refreshToken = createToken({
        payload,
        secret: configService.jwt_refresh_secret,
        options: {
            ...options,
            expiresIn: configService.jwt_refresh_exp
        }
    })

    return { accessToken, refreshToken }
}


const getSecret = tokenType => tokenType == tokenTypeEnum.REFRESH ?  configService.jwt_refresh_secret : configService.jwt_access_secret


export const createToken = ({ payload = {}, options = {}, secret = configService.jwt_access_secret }) => {
    return jwt.sign(
        payload,
        secret,
        options
    )
}


export const verifyToken = ({ token, tokenType = tokenTypeEnum.ACCESS }) => {
    return jwt.verify(token, getSecret(tokenType))
}
