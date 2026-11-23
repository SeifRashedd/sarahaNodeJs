import { exception, myHash, myCompare, encryption, ProviderEnum, logoutEnum, emailEventsEnum } from "../../common/index.js";
import { createTokens } from "../../common/security/index.js";
import configService from "../../config/config.service.js";
import { conflictException, unAuthorizedException } from "../../common/utils/exception.js";
import ur from './../../database/repo/user.repo.js'
import { OAuth2Client } from 'google-auth-library';
import { set, get, delByPrefix, del } from "../../common/service/cache.service.js";
import { userRevokeKey, userKeyBase, userOtpKey } from "../../common/service/cahce_key.service.js";
import { emailEvent } from "../../common/events/email_event.js";


const client = new OAuth2Client();



export const signup = async (data) => {
    let exists = await ur.findOne({
        filter: { email: data.email }
    })
    if (exists) exception.conflictException({ message: "User already exists" });
    data.password = await myHash({ plainText: data.password });
    if (data.phone) data.phone = await encryption({ plainText: data.phone });
    let user = await ur.create({ data });

    let otp = Math.trunc(Math.random() * 1000000).toString().padStart(4, "5")

    await set({
        key: userOtpKey({ userId: user.id }),
        value: otp,
        ttl: 300
    })

    emailEvent.emit(emailEventsEnum.SIGNUP, {
        email: user.email,
        userName: user.userName,
        otp,
    })
    return user;
}



export const login = async ({ email, password }) => {
    let user = await ur.findOne({ filter: { email } });
    if (!user) exception.notFoundException({ message: "User not found" });
    let matchPassword = await myCompare({ plainText: password, encrypted: user.password });
    if (!matchPassword) exception.unAuthorizedException({ message: "Invalid credentials" });
    if (!user.confirmEmail) exception.forbiddenException({ message: "please confirm your email first" })
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
        audience: configService.google_client_id,

    });
    let { email, email_verified, picture, name } = ticket.getPayload()
    if (!email_verified) unAuthorizedException({ message: "This email is not verified" })
    let status = 200
    let user = await ur.findOne({
        filter: { email }
    })
    if (!user) {
        user = await ur.create({ data: { email, image: picture, userName: name, provider: ProviderEnum.google } })
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
            await ur.updateOne({ filter: { _id: payloads.sub }, update: { changeCredentialAt: Date.now() } })
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


export const confirmEmail = async ({ email, otp }) => {
    let user = await ur.findOne({ filter: { email } })
    if (!user) exception.notFoundException({ message: "user not found" })
    if (user.confirmEmail) exception.badRequestException({ message: "user already confirmed" })

    let stored = await get({
        key: userOtpKey({ userId: user.id }),
    })

    if (!stored) exception.badRequestException({ message: "otp expired" })
    if (stored != otp) exception.unAuthorizedException({ message: "invalid otp" })

    user.confirmEmail = new Date()
    await user.save()
    await del({
        key: userOtpKey({ userId: user.id }),
    })
}