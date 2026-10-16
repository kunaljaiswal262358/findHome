import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    title: {type: String},
    descrpition: {type: String},
    homeId: {type: mongoose.Schema.Types.ObjectId, required: true}, 
    rent: {type: Number, min: 0, requried: true},
    sharingCount: {type: Number, min: 0, max: 5, required: true},
    images: {type: [Number]},
    ratings: {type: Number, min: 0, max: 5},
    createdAt: {type: Date, default: Date.now()}
})

export const Room = mongoose.model("Room", roomSchema)