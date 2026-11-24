import { EventEmitter } from "node:events";
import { emailEventsEnum } from "../enums/index.js";
import { sendMail } from "../service/mail_service.js";
import { emailTemp } from "../template/index.js";



export const emailEvent = new EventEmitter();

emailEvent.on(emailEventsEnum.SIGNUP, async ({ email, userName, otp, otpExpiresIn }) => {
    try {
        await sendMail({
            to: email,
            subject: "Welcome to Saraha - confirm your email",
            html: emailTemp({
                title: "Welcome to Saraha",
                userName,
                message: "Your account was created successfully. Use the code below to confirm your email.",
                otp,
                otpExpiresIn
            })
        })
    } catch (error) {
        console.log("signup email error:", error.message)
    }
})

emailEvent.on(emailEventsEnum.FORGET, async ({ email, userName, otp, otpExpiresIn }) => {
    try {
        await sendMail({
            to: email,
            subject: "Forget Password",
            html: emailTemp({
                title: "Forget Password",
                userName,
                message: "Reset your password using the code below.",
                otp,
                otpExpiresIn
            })
        })
    } catch (error) {
        console.log("forget password email error:", error.message)
    }
})
