import { Router } from "express";
import { response } from "../../common/index.js";
import * as us from './user.service.js';

export const userRouter = Router();




userRouter.get("/profile", async (req, res) => {
    let token = req.headers.authorization;
    let user = await us.profile(token);
    response(res, 200, user, "User profile fetched successfully");
})




