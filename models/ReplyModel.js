import { Schema, model } from "mongoose";

const ReplySchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ReplyModel = model("Reply", ReplySchema);
export default ReplyModel;