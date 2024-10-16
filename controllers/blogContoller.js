import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import fs from 'fs';

export const getBlogs=async (req,res)=>{
  try {
    const blogs = await Blog.find(); // Fetch all contacts from the database
    return res.status(200).json(blogs); // Return contacts in response
  } catch (err) {
    return res.status(500).json({ error: `Error fetching contacts: ${err.message}` }); // Handle errors
  }
}

export const addBlog=async(req,res)=>{
  const {title,author,description}=req.body;
  try {
    await Blog.create({
      title,
      image:req.imagePath,
      author,
      description

    })
    return res.status(200).json({message:"Blog Added SuccessFully"})
    
  } catch (err) {
    fs.unlink(`.${req.imagePath}`,(err)=>{
    })
    return res.status(400).json({error:`${err}`})
    
  }
}

export const removeBlog=async(req,res)=>{
  const {id}=req.params;
try {
  if(mongoose.isValidObjectId(id)){
    const isExist=await Blog.findById(id)
    if(isExist){
      await Blog.deleteOne({_id:id})
      return res.status(200).json({message:'SuccessFully Deleted'})
    }else{
      return res.status(400).json({message:'Error Occured'})
    }
  
  }
  
} catch (err) {
  return res.status(400).json({error:`${err}`})
  
}

}