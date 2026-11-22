import { Router } from "express";
import { response, tokenTypeEnum, validation } from "../../common/index.js";
import * as as from './auth.service.js';
import { auth } from "../../common/middleware/authentication.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRouter = Router();



authRouter.post("/signup", validation(signupSchema), async (req, res) => {

    let user = await as.signup(req.validate.body);
    response(res, 201, user, "User created successfully");
})

authRouter.post("/login", validation(loginSchema), async (req, res) => {
    let user = await as.login(req.validate.body);
    response(res, 200, user, "User logged in  successfully");
})



authRouter.post('/rotate_token', auth({ tokenType: tokenTypeEnum.REFRESH }), async (req, res, next) => {
    let tokens = await as.rotateToken(req.user, req.payload)
    response(res, 200, tokens, 'token rotated')
})

authRouter.post('/loginWithGoogle', async (req, res, next) => {
    let { tokens, status } = await as.loginWithGoogle(req.body)
    response(res, status, tokens, "login done", status == 200 ? 'user logged in' : 'user created');
})



authRouter.post('/logout', auth({ tokenType: tokenTypeEnum.ACCESS }), async (req, res, next) => {
    await as.logout(req.payload, req.body)
    response(res, 200, null, "User logged out successfully")
})


