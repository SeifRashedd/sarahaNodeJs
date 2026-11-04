import { Router } from "express";
import { response } from "../../common/index.js";
import * as as from './auth.service.js';

export const authRouter = Router();



authRouter.post("/signup", async (req, res) => {
    let user = await as.signup(req.body);
    response(res, 201, user, "User created successfully");
})


authRouter.post("/login", async (req, res) => {
    let user = await as.login(req.body);
    response(res, 200, user, "User logged in  successfully");
})




