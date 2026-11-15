import { Router } from "express";
import { response, tokenTypeEnum, validation } from "../../common/index.js";
import * as as from './auth.service.js';
import { auth } from "../../common/middleware/authentication.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRouter = Router();



authRouter.post("/signup", validation(signupSchema), async (req, res) => {

    let user = await as.signup(req.validate);
    response(res, 201, user, "User created successfully");
})

authRouter.post("/login", validation(loginSchema), async (req, res) => {
    let user = await as.login(req.validate);
    response(res, 200, user, "User logged in  successfully");
})



authRouter.post('/rotate_token', auth({ tokenType: tokenTypeEnum.REFRESH }), (req, res, next) => {
    let tokens = as.rotateToken(req.user, req.payload)
    response(res, 200, tokens, 'token rotated')
})

authRouter.post('/loginWithGoogle', async (req, res, next) => {
    let { tokens, status } = await as.loginWithGoogle(req.body)
    response(res, status, tokens, "login done", status == 200 ? 'user logged in' : 'user created');
})



