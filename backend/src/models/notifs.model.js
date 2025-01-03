import mongoose from "mongoose";

const notifSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true},
    message: {
        type: String,
        required: true },
    seen: {
        type: Boolean,
        default: false }, 
    createdAt: {
        type: Date,
        default: Date.now },
});

const notifs = mongoose.Schema({
  userId:{
    type: String, 
    required: false,
    unique:true},
  name:{
    type:String,
    required:false},
  notifications: {
    type: [notifSchema],
    default: [],
  },
});

export default mongoose.model("Notif", notifs);