// NoteModel.js

import { Schema, model } from "mongoose";

const NoteSchema = new Schema(
    {
        _id:{
            type: Number,
            required: true
        },
        
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        photo_url: {
            type: String,
            required: true
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
    },
    {
        timestamps: true
    }
);

const NoteModel = model("Note", NoteSchema);
export default NoteModel;
