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
    jwtSecret: process.env.JWT_SECRET
}


