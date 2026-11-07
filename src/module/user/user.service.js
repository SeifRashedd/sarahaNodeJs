import { UserModel } from "../../database/models/index.js"
import { verifyToken } from "../../common/security/index.js";





export const updateUser = async (data) => {
    let { sub } = verifyToken({ token })
    let user = await UserModel.findByIdAndUpdate(user_id , data)
    return user
}