import { UserModel } from "../../database/models/index.js"
import { exception, myHash, myCompare, encryption } from "../../common/index.js";
import { createTokens } from "../../common/security/index.js";
import configService from "../../config/config.service.js";
import { conflictException } from "../../common/utils/exception.js";



export const signup = async (data) => {
    let exists = await UserModel.findOne({ email: data.email });
    if (exists) exception.conflictException({ message: "User already exists" });
    data.password = await myHash({ plainText: data.password });
    if (data.phone) data.phone = await encryption({ plainText: data.phone });
    let user = await UserModel.create(data);
    return user;
}



export const login = async ({ email, password }) => {
    let user = await UserModel.findOne({ email });
    if (!user) exception.notFoundException({ message: "User not found" });
    let matchPassword = await myCompare({ plainText: password, encrypted: user.password });
    if (!matchPassword) exception.unAuthorizedException({ message: "Invalid credentials" });
    let tokens = createTokens({ payload: { sub: user.id } });
    return { tokens };
}


export const rotateToken = (user , payload) => {
    // access and refresh tokens are created together, so they share the same iat
    let accessIAT = payload.iat*1000
    let accessEXPIN = configService.jwt_access_exp*1000
    let accessEXPAt = accessEXPIN + accessIAT 
    let currentTime = Date.now()
    if (currentTime < accessEXPAt) {
        conflictException({ message: "access token still valid" })
    }
    let tokens = createTokens({ payload: { sub: user.id } });
    return { tokens };
}