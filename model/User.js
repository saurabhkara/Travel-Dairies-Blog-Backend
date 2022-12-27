import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type:String, required:true},
    email:{type:String, require:true},
    password:{type:String,required:true,minLength:6},
    posts:[{type:mongoose.Types.ObjectId,ref:'Post'}],
})

export default mongoose.model('User',userSchema);