import { notFoundException } from "../../common/index.js"
import { userRepo, messageRepo } from "../../database/repo/index.js"






export const createMessage = async ({ receiverId, content }, attachments = []) => {
    let receiver = await userRepo.findById({
        id: receiverId
    })
    if (!receiver) {
        notFoundException({ message: 'receiver not found' })
    }
    let message = await messageRepo.create({
        data: {
            receiverId: receiver._id,
            ...(content ? { content } : {}),
            ...(attachments.length > 0 ? { attachments: attachments.map((att) => att.path) } : {})
        }
    })
    return message

}