import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, 
        required: true
    }, 
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        requried: true
    }, 
    gender: {
        type: String, 
        required: true, 
        enum: ["male", "female"]
    }, 
    profile_pic: {
        type: String, 
        default: ""
    }
});

const User = mongoose.model("User", userSchema);

export default User;

