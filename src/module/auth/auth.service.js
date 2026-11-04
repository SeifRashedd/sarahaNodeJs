import { UserModel } from "../../database/models/index.js"
import { exception, myHash, myCompare, encryption } from "../../common/index.js";
import jwt from "jsonwebtoken";
import configService from "../../config/config.service.js";



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
    let token = jwt.sign({ sub: user.id }, configService.jwtSecret);
    return { token };
}