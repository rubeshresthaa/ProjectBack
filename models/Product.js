
import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  breeds:{
    type:String,
    required:true,
    enum:['Labrador','German Shephard','Pit Bull','Pug','Huskey','Golden Retriver']
  },
  description:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true,
    enum:['Cat','Dog']
  },
  rating:{
    type:Number,
    default:0
  },
  stock:{
    type:Number,
    default:0
  }
},{timestamps:true})

export const Product=mongoose.model('Product',productSchema)