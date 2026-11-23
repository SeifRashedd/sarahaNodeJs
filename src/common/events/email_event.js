import { EventEmitter } from "node:events";
import { emailEventsEnum } from "../enums/index.js";
import { sendMail } from "../service/mail_service.js";
import { emailTemp } from "../template/index.js";



export const emailEvent = new EventEmitter();

emailEvent.on(emailEventsEnum.SIGNUP, async ({ email, userName }) => {
    try {
        await sendMail({
            to: email,
            subject: "Welcome to Saraha",
            html: emailTemp({
                title: "Welcome to Saraha",
                userName,
                message: "Your account was created successfully. You can now log in and start receiving anonymous messages."
            })
        })
    } catch (error) {
        console.log("signup email error:", error.message)
    }
})
