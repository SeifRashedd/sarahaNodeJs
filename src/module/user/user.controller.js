import { Router } from "express";
import { response } from "../../common/index.js";
import * as us from './user.service.js';
import { auth } from '../../common/middleware/index.js'

export const userRouter = Router();

userRouter.use(auth())

userRouter.get("/profile", async (req, res) => {
    response(res, 200, req.user, "User profile fetched successfully");
})



userRouter.put("/update_user", async (req, res) => {
    let user = await us.updateUser(req.body)
    response({
        res, user, message: "user update successfully"
    })
})


