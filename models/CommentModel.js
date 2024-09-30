import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    note: { 
        type: Number, 
        ref: "Note", 
        required: true 
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Reply"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentModel = model("Comment", CommentSchema);
export default CommentModel;