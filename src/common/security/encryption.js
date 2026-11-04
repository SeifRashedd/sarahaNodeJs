import crypto from "crypto";
import confgService from '../../config/config.service.js';


let { encIvLength, encKey, encAlgo } = confgService;
let key = Buffer.from(encKey, 'hex');

export const encryption = async ({ plainText }) => {
    const iv = crypto.randomBytes(encIvLength);
    let cipherIv = crypto.createCipheriv(encAlgo, key, iv);
    let result = cipherIv.update(plainText, 'utf-8', 'hex');
    result += cipherIv.final('hex');
    return `${iv.toString('hex')}::${result}`
}


export const decryption = (cypherText) => {
    let [hexIv , encrypted] = cypherText.split('::');
    const iv = Buffer.from(hexIv, 'hex');
    let decipher = crypto.createDecipheriv(encAlgo, key, iv);
    let result = decipher.update(encrypted, 'hex', 'utf-8');
    result += decipher.final('utf-8');
    return result;
}