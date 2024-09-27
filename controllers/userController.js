import {Users} from "../models/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


export const getUsers= (req,res)=>{
  return res.status(200).json({message:'All Users'})
}


export const userLogin= async (req,res)=>{
  const {email,password}=req.body;
//Check user
  try {
    const isExist=await Users.findOne({email});
    if(!isExist){
      return res.status(404).json({message:'User Not Found.'})
    }
//password Check
    const pass=bcrypt.compareSync(password,isExist.password);
    if(!pass){
      return res.status(405).json({message:'Invalid Password'})
    }
//token given
    const token=jwt.sign({
      id:isExist._id,
      isAdmin:isExist.isAdmin
    },'secret');

    return res.status(200).json({
      token,
      id:isExist._id,
      email:isExist.email,
      fullname:isExist.fullname,
      isAdmin:isExist.isAdmin 
    })
    
  } catch (err) {
    return res.status(404).json({error:`${err}`})  
  }
}

export const registerUser=async (req,res)=>{
  const{fullname,email,password}=req.body;
//check is email is already use or not
  try {
    const isExist=await Users.findOne({email:email});
    if(isExist){
      return res.status(409).json({message:'Email Already Used'})
    }
    //creating hash Password for security purpose
    const hashPass=bcrypt.hashSync(password, 10);
//create new user
    await Users.create({
      fullname:fullname,
      password:hashPass,
      email:email
    })
    return res.status(200).json({message:'Registration Successfull'})
    
  } catch (err) {
    return res.status(404).json({error:`${err}`})
    
  }

}