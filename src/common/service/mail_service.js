import nodemailer from "nodemailer";
import configService from "../../config/config.service.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: configService.email_user,
        pass: configService.pass_user
    }
})


transporter.verify()
    .then(() => console.log("connected to email"))
    .catch((error) => console.log("email connection error:", error.message))


export const sendMail = async ({ to, subject, html }) => {
    return await transporter.sendMail({
        from: `"Saraha" <${configService.email_user}>`,
        to,
        subject,
        html
    })
}
