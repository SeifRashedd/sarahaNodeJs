import { langEnum } from "../enums/index.js"

export default (message, lang) => {
    let langString = lang == langEnum.ar ? 'ar' : 'en';
    return message[langString]
}



let messages = {
    invalidEmail: {
        ar: 'البريد الالكتروني غير صحيح',
        en: 'invalid email'
    },
    shortPassword: {
        ar: 'كلمه السر قصيره جدا',
        en: 'password is too short'
    },
    longPassword: {
        ar: 'كلمه السر طويله جدا',
        en: 'password is too long'
    },
    invalidId: {
        ar: 'id غير صحيح',
        en: 'invalid id'
    },
    shortUserName: {
        ar: 'اسم المستخدم قصير جدا',
        en: 'user name is too short'
    },
    fullUserName: {
        ar: 'اسم المستخدم لازم يكون الاسم الاول والاخير بينهم مسافه',
        en: 'user name must be first and last name separated by a space'
    },
    invalidPhone: {
        ar: 'رقم الهاتف غير صحيح، لازم يبدأ بـ +',
        en: 'invalid phone number, must start with +'
    },
    invalidGender: {
        ar: 'النوع غير صحيح، لازم يكون 0 (ذكر) او 1 (انثى)',
        en: 'invalid gender, must be 0 (male) or 1 (female)'
    },
    invalidOtp: {
        ar: 'الكود لازم يكون من 4 لـ 6 أرقام',
        en: 'otp must be 4 to 6 digits'
    },
}



export const keys = messages