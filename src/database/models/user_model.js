import mongoose from "mongoose";
import { genderEnum } from "../../common/index.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true,
    },
    lastName: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true,
    },
    email: {
        type: String,
        maxLength: 50,
        minLength: 2,
        unique: true,
        required: true,
    },
    gender: {
        type: Number,
        enum: Object.values(genderEnum),
        default: genderEnum.male,
    },
    password: {
        type: String,
        required: true,
        // select: false
    },
    phone: {
        type: String,
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    autoIndex: true,

});

userSchema.virtual("userName").set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});



export const UserModel = mongoose.model("User", userSchema);
