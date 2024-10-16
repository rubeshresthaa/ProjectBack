import mongoose from 'mongoose';
import {Contact} from '../models/Contact.js'

export const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contacts from the database
    return res.status(200).json(contacts); // Return contacts in response
  } catch (err) {
    return res.status(500).json({ error: `Error fetching contacts: ${err.message}` }); // Handle errors
  }
};

export const submitContact=async (req,res)=>{
  const {fullname,email,subject}=req.body;
  try {
    await Contact.create({
      fullname,
      email,
      subject
    })
    return res.status(200).json({message:'SuccessFully submitted'})
    
  } catch (err) {
    return res.status(400).json({error:`${err}`})
    
  }
}


export const removeContact =async (req,res)=>{
  const {id}=req.params;
  try {
    if(mongoose.isValidObjectId(id)){
      const isExist= await Contact.findById(id);
      if(isExist){
        await Contact.deleteOne({_id:id});
        return res.status(200).json({message:'Successfully Deleted'})
      }
      return res.status(400).json({message:'Please Recheck the Valid information'})

    }
    
  } catch (err) {
    return res.status(400).json({error:`${err}`})
    
  }

}
