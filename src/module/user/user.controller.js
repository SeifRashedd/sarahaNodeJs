import { Router } from "express";
import { response } from "../../common/index.js";
import * as us from './user.service.js';
import { auth } from '../../common/middleware/index.js'

export const userRouter = Router();

userRouter.use(auth)

userRouter.get("/profile", async (req, res) => {
    response(res, 200, req.user, "User profile fetched successfully");
})





userRouter.put("/update_user", async (req, res) => {
    // let token = req.headers.authorization;
    // let user = await us.profile(token);
    // response(res, 200, user, "User profile fetched successfully");
})


