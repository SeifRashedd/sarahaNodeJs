import us from './../../database/repo/user.repo.js'


export const updateUser = async (userData, data) => {
    let user = await us.findByIdAndUpdate({
        id: userData._id,
        update: data
    })
    return user
}