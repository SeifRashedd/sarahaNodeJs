import jwt from "jsonwebtoken";
import configService from "../../config/config.service.js";
import { tokenTypeEnum } from "../enums/index.js";
import { userRevokeKey } from "../service/cahce_key.service.js";
import { get } from "../service/cache.service.js";
import { unAuthorizedException } from "../utils/exception.js";
import ur from "./../../database/repo/user.repo.js";

export const createTokens = ({ payload = {}, options = {} } = {}) => {
    let jti = crypto.randomUUID()
    let accessToken = createToken({
        payload,
        secret: configService.jwt_access_secret,
        options: {
            ...options,
            expiresIn: configService.jwt_access_exp,
            jwtid: jti
        }
    })

    let refreshToken = createToken({
        payload,
        secret: configService.jwt_refresh_secret,
        options: {
            ...options,
            expiresIn: configService.jwt_refresh_exp,
            jwtid: jti
        }
    })

    return { accessToken, refreshToken }
}


const getSecret = tokenType => tokenType == tokenTypeEnum.REFRESH ? configService.jwt_refresh_secret : configService.jwt_access_secret


export const createToken = ({ payload = {}, options = {}, secret = configService.jwt_access_secret }) => {
    return jwt.sign(
        payload,
        secret,
        options
    )
}


export const verifyToken = async ({ token, tokenType = tokenTypeEnum.ACCESS }) => {
    let decoded = jwt.decode(token)

    if (decoded?.jti && decoded?.sub) {
        let isRevoked = await get({ key: userRevokeKey({ userId: decoded.sub, jti: decoded.jti }) })
        if (isRevoked) unAuthorizedException({ message: "Token is revoked" })
    }

    let user = await ur.findById({ id: decoded.sub, projection: { changeCredentialAt: 1 } })
    if (user && user.changeCredentialAt) {
        let credChangedAtSec = Math.floor(user.changeCredentialAt.getTime() / 1000)
        if (credChangedAtSec > decoded.iat) {
            unAuthorizedException({ message: "Token is expired due to credential change" })
        }
    }

    return jwt.verify(token, getSecret(tokenType))
}
