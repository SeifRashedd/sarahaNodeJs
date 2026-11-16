import { notFoundException } from '../../common/utils/exception.js'
import ur from './../../database/repo/user.repo.js'


export const updateUser = async (userData, data) => {
    let user = await ur.findByIdAndUpdate({
        id: userData._id,
        update: data
    })
    return user
}

export const getUserProfile = async (userID) => {
    let user = await ur.findById({
        id: userID,
        projection: { password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0, provider: 0 }
    });
    if (!user) notFoundException({ message: "user not found" });
    return user;
};