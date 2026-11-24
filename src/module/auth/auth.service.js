import { exception, myHash, myCompare, encryption, ProviderEnum, logoutEnum, emailEventsEnum } from "../../common/index.js";
import { createTokens } from "../../common/security/index.js";
import configService from "../../config/config.service.js";
import { conflictException, unAuthorizedException } from "../../common/utils/exception.js";
import ur from './../../database/repo/user.repo.js'
import { OAuth2Client } from 'google-auth-library';
import { set, get, delByPrefix, del, ttl, incr } from "../../common/service/cache.service.js";
import { userRevokeKey, userKeyBase, userSubjectedOtpKey, userTrialsOtpKey, userBlockOtpKey, userWrongOtpTrialsKey, userWrongOtpBlockKey, userVerifiedOtpKey } from "../../common/service/cahce_key.service.js";
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
    await createAndSendOtp({ user, subject: emailEventsEnum.SIGNUP })
    return user;
}


export const createAndSendOtp = async ({ user, subject, maxTrials = 5, blockTtl = 900 }) => {
    let userId = user.id
    let blockKey = userBlockOtpKey({ userId, subject })
    let trialsKey = userTrialsOtpKey({ userId, subject })

    let remainingBlock = await ttl({ key: blockKey })
    if (remainingBlock > 0) exception.tooManyRequestsException({ message: `You cant request otp again, try after ${Math.ceil(remainingBlock / 60)} minutes` })

    let trials = await get({ key: trialsKey })
    if (trials >= maxTrials) {
        await set({
            key: blockKey,
            value: true,
            ttl: blockTtl
        })
        await del({ key: trialsKey })
        exception.tooManyRequestsException({ message: `You cant request otp again, try after ${Math.ceil(blockTtl / 60)} minutes` })
    }

    let otp = Math.trunc(Math.random() * 1000000).toString().padStart(4, "5")

    await set({
        key: userSubjectedOtpKey({ userId, subject }),
        value: otp,
        ttl: 300
    })

    emailEvent.emit(subject, {
        email: user.email,
        userName: user.userName,
        otp,
        otpExpiresIn: 5
    })

    await incr({ key: trialsKey })
}



export const login = async ({ email, password }) => {
    let user = await ur.findOne({ filter: { email } });
    if (!user) exception.notFoundException({ message: "User not found" });
    if (!user.confirmEmail) {
        await createAndSendOtp({
            user,
            subject: emailEventsEnum.SIGNUP
        })
    }
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

    await verifyOtp({ userId: user.id, subject: emailEventsEnum.SIGNUP, otp })

    user.confirmEmail = new Date()
    await user.save()
}



export const resendOtp = async ({ email }) => {
    let user = await ur.findOne({
        filter: {
            $and: [
                { email },
                { $or: [{ confirmEmail: { $exists: false } }, { confirmEmail: null }] }
            ]
        }
    })
    if (!user) exception.notFoundException({ message: "user not found or already confirmed" })
    let wrongBlock = await ttl({
        key: userWrongOtpBlockKey({ userId: user.id, subject: emailEventsEnum.SIGNUP }),
    })
    if (wrongBlock > 0) exception.tooManyRequestsException({ message: `Too many wrong otp, try after ${Math.ceil(wrongBlock / 60)} minutes` })
    let otpExist = await ttl({
        key: userSubjectedOtpKey({ userId: user.id, subject: emailEventsEnum.SIGNUP }),
    })
    if (otpExist > 0) exception.conflictException({ message: "otp not expired yet" })
    await createAndSendOtp({
        user: user,
        subject: emailEventsEnum.SIGNUP
    })
}



export const forgetPassword = async ({ email }) => {
    let user = await ur.findOne({
        filter: {
            $and: [
                { email },
                { confirmEmail: { $ne: null } }   // confirmEmail is a Date, so "confirmed" = not null / not missing
            ]
        }
    })
    if (!user) exception.notFoundException({ message: "user not found" })
    await createAndSendOtp({ user, subject: emailEventsEnum.FORGET })
}


export const verifyForgetPasswordOtp = async ({ email, otp }) => {
    let user = await ur.findOne({ filter: { email } })
    if (!user) exception.notFoundException({ message: "user not found" })
    await verifyOtp({ userId: user.id, subject: emailEventsEnum.FORGET, otp })
    await set({
        key: userVerifiedOtpKey({ userId: user.id, subject: emailEventsEnum.FORGET }),
        value: true,
        ttl: 300
    })
}


export const resetPassword = async ({ email, newPassword }) => {
    let user = await ur.findOne({ filter: { email } })
    if (!user) exception.notFoundException({ message: "user not found" })
    let verifiedKey = userVerifiedOtpKey({ userId: user.id, subject: emailEventsEnum.FORGET })
    let verified = await get({ key: verifiedKey })
    if (!verified) exception.forbiddenException({ message: "verify your otp first" })

    user.password = await myHash({ plainText: newPassword })
    await user.save()
    await del({ key: verifiedKey })
}



export const verifyOtp = async ({ userId, subject, otp }) => {

    let otpKey = userSubjectedOtpKey({ userId, subject })
    let wrongTrialsKey = userWrongOtpTrialsKey({ userId, subject })
    let wrongBlockKey = userWrongOtpBlockKey({ userId, subject })
    let maxWrongTrials = 5
    let blockTtl = 900

    let remainingBlock = await ttl({ key: wrongBlockKey })
    if (remainingBlock > 0) exception.tooManyRequestsException({ message: `Too many wrong otp, try after ${Math.ceil(remainingBlock / 60)} minutes` })

    let stored = await get({ key: otpKey })
    if (!stored) exception.badRequestException({ message: "otp expired" })

    if (stored != otp) {
        let wrongTrials = await incr({ key: wrongTrialsKey })
        if (wrongTrials >= maxWrongTrials) {
            await set({
                key: wrongBlockKey,
                value: true,
                ttl: blockTtl
            })
            await del({ key: wrongTrialsKey })
            await del({ key: otpKey })
            exception.tooManyRequestsException({ message: `Too many wrong otp, try after ${Math.ceil(blockTtl / 60)} minutes` })
        }
        exception.unAuthorizedException({ message: `invalid otp, ${maxWrongTrials - wrongTrials} trials left` })
    }

    await del({ key: otpKey })
    await del({ key: wrongTrialsKey })
    await del({ key: userTrialsOtpKey({ userId, subject }) })
}