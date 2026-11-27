import { Schema, Types } from "mongoose";
import mongoose from "mongoose";


let messageSchema = new Schema({

    receiverId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderId: {
        type: Types.ObjectId,
    },

    content: {
        type: String,
        minLength: 5,
        maxLength: 5000,
        required: function () {
            return this.attachments.length < 1
        },
    },
    attachments: {
        type: [String],

    },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

export default mongoose.model("Message", messageSchema)