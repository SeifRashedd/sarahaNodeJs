import { hash, compare } from "bcrypt"
import configService from "../../config/config.service.js"

export const myHash = async ({ plainText }) => {
    return await hash(plainText, configService.salt)
}


export const myCompare = async ({ plainText, encrypted }) => {
    return await compare(plainText, encrypted)
}