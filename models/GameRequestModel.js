import { model, Schema } from "mongoose";

const GameRequestSchema = new Schema({
    game_name : {
        type : String,
        required : true
    },
    game_image_url : {
        type : String,
        required : true
    },
    game_release_year : {
        type : String,
        required : true
    },
    game_description : {
        type : String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
})

const GameRequestModel = model("GameRequest",GameRequestSchema);
export default GameRequestModel;