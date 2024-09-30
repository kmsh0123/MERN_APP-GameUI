import {Schema,model } from "mongoose";


const CounterSchema = new Schema({
    name: {
    type: String,
    required: true,
    },
    seq: {
    type: Number,
    default: 0 
    },
});

const CounterModel = model("Counter", CounterSchema);
export default CounterModel;