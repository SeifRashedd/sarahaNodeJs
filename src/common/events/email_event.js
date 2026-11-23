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
