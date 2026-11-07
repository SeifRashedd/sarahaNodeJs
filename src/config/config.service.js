import { config } from "dotenv";
import { resolve } from "path";


let envFilePath = resolve(`.env.${process.env.NODE_ENV || "development"}`);

config({
    path: envFilePath
});


export default {
    port: Number(process.env.PORT),
    dbUri: process.env.DB_URI,
    salt: Number(process.env.SALT),
    encKey: process.env.ENC_KEY,
    encIvLength: Number(process.env.ENC_IV_LENGTH),
    encAlgo: process.env.ENC_IV_ALGO,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_exp: Number(process.env.JWT_ACCESS_EXP),
    jwt_refresh_exp: process.env.JWT_REFRESH_EXP
}


