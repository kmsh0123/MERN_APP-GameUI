import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    // banReason: {
    //     type: String,
    //     default: ""
    // },
    role: {
        type: String,
        enum: ["admin","user"],
        default: "user"
    }
}, {
    timestamps: true
});
;

// Create models
const UserModel = model("User", UserSchema);
export default UserModel;
