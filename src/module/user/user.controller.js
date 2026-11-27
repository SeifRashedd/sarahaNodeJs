import { Router } from "express";
import { response, exception } from "../../common/index.js";
import * as us from './user.service.js';
import { auth, validation, multerMiddleware } from '../../common/middleware/index.js'
import { userProfileSchema } from './user_validation.js'
import { proccesFile, fileTypes } from "../../common/middleware/multer.js";

export const userRouter = Router();

userRouter.get("/user-profile/:userId", validation(userProfileSchema), async (req, res) => {
    let user = await us.getUserProfile(req.validate.params.userId);
    response(res, 200, user, "User profile fetched successfully");
});

userRouter.use(auth());

userRouter.get("/profile", async (req, res) => {
    response(res, 200, req.user, "User profile fetched successfully");
});

userRouter.put("/update_user", async (req, res) => {
    let user = await us.updateUser(req.user, req.body);
    response(res, 200, user, "user update successfully");
});




userRouter.post("/image",multerMiddleware({storageFolder:'user' , types:[fileTypes.image]}).single('image'), proccesFile([fileTypes.image], 'user') ,async (req, res , next) => {
    if (!req.file) exception.badRequestException({ message: "image is required" })
    console.log(req.file);
    response(res, 200, req.file, "image uploaded successfully");
});



