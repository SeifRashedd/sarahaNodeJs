import { Router } from "express";
import { response, tokenTypeEnum } from "../../common/index.js";
import * as as from './auth.service.js';
import { auth } from "../../common/middleware/authentication.js";

export const authRouter = Router();



authRouter.post("/signup", async (req, res) => {
    let user = await as.signup(req.body);
    response(res, 201, user, "User created successfully");
})


authRouter.post("/login", async (req, res) => {
    let user = await as.login(req.body);
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



