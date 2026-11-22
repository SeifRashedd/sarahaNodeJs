import { exception, myHash, myCompare, encryption, ProviderEnum, logoutEnum } from "../../common/index.js";
import { createTokens } from "../../common/security/index.js";
import configService from "../../config/config.service.js";
import { conflictException, unAuthorizedException } from "../../common/utils/exception.js";
import ur from './../../database/repo/user.repo.js'
import { OAuth2Client } from 'google-auth-library';
import { set, delByPrefix } from "../../common/service/cache.service.js";
import { userRevokeKey, userKeyBase } from "../../common/service/cahce_key.service.js";


const client = new OAuth2Client();



export const signup = async (data) => {
    let exists = await ur.findOne({
        filter: { email: data.email }
    })
    if (exists) exception.conflictException({ message: "User already exists" });
    data.password = await myHash({ plainText: data.password });
    if (data.phone) data.phone = await encryption({ plainText: data.phone });
    let user = await ur.create({ data });
    return user;
}



export const login = async ({ email, password }) => {
    let user = await ur.findOne({ filter: { email } });
    if (!user) exception.notFoundException({ message: "User not found" });
    let matchPassword = await myCompare({ plainText: password, encrypted: user.password });
    if (!matchPassword) exception.unAuthorizedException({ message: "Invalid credentials" });
    let tokens = createTokens({ payload: { sub: user.id } });
    return { tokens };
}


export const rotateToken = async (user, payload) => {
    let accessIAT = payload.iat * 1000
    let accessEXPIN = configService.jwt_access_exp * 1000
    let accessEXPAt = accessEXPIN + accessIAT
    let currentTime = Date.now()
    if (currentTime < accessEXPAt) {
        conflictException({ message: "access token still valid" })
    }
    let tokens = createTokens({ payload: { sub: user.id } });

    await revokeToken(payload)

    return { tokens };
}

export const loginWithGoogle = async (data) => {
    console.log(data)
    const ticket = await client.verifyIdToken({
        idToken: data.idToken,
        audience: WEB_CLIENT_ID,

    });
    let { email, email_verified, picture, name } = payload
    if (!email_verified) unAuthorizedException("This email is not verified")
    let status = 2000
    let user = await ur.findOne({
        filter: { email }
    })
    if (!user) {
        user = ur.create({ data: { email, image: picture, userName: name, provider: ProviderEnum.google } })
        status = 201
    }
    return { tokens: createTokens({ payload: { sub: user.id } }), status }
}


export const logout = async (payloads, { action = logoutEnum.DEVICE }) => {
    console.log(action)
    switch (action) {
        case logoutEnum.DEVICE:
            return await revokeToken(payloads)
            break
        default:
            await ur.updateOne({ filter: { _id: payloads.sub }, update: { changCredentialAt: Date.now() } })
            await delByPrefix({ prefix: `${userKeyBase({ userId: payloads.sub })}*` })
            return
            break   



    }


}


export const revokeToken = async (payload) => {
    let { exp, jti, sub } = payload
    let nowInSec = Math.ceil(Date.now() / 1000)
    let tti = exp - nowInSec
    let revokeKey = userRevokeKey({ userId: sub, jti })

    await set({
        key: revokeKey,
        value: jti,
        ttl: tti
    })
    return { ...payload, nowInSec, tti }
}
