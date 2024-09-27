
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  fullname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

export const Users=mongoose.model('Users',userSchema)