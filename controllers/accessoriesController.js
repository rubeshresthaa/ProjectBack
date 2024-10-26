import mongoose from "mongoose";
import fs from 'fs';
import { Accessory } from "../models/Accessories.js";

export const getAccessories=async(req,res)=>{
  try {
    const excludeType=['sort','fields','page','search','limit'];

    const queryObject={...req.query}

    excludeType.forEach((query)=>{
      delete queryObject[query]
    })

    if(req.query.search){
      queryObject.title={ $regex: req.query.search, $options: 'i' }
    }

    let qstr=JSON.stringify(queryObject);
    qstr = qstr.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);

    let query=Accessory.find(JSON.parse(qstr))

    if(req.query.sort){
      const sorting = req.query.sort.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');
      query.sort(sorting);
    }
  
if(req.query.fields){
  const fields = req.query.sort.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');

    query.select(fields)
}

//pagination

const page = req.query.page || 1;
const limit = req.query.limit || 10;

const skip = (page - 1) * limit;


const products = await query.skip(skip).limit(limit);
const length = await Accessory.countDocuments();
return res.status(200).json({
  products,
  length
});

  } catch (err) {
    return res.status(400).json({error:`$${err}`})
    
  }

}


export const getAccessoriesById = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const accessories = await Accessory.findById(id)
      .select('-createdAt -updatedAt -__v')
      .populate({
        path: 'reviews.user',
        select: 'fullname email',
      });

    // Check if the accessory was found
    if (!accessories) {
      return res.status(404).json({ message: 'Accessories not found' });
    }

    return res.status(200).json(accessories);
  } catch (err) {
    // Log the error for debugging
    console.error('Error fetching accessories:', err);
    return res.status(500).json({ error: `Server Error: ${err.message}` });
  }
};


export const addAccessories=async (req,res)=>{
  const {title, category,description, stock, price}=req.body;
  console.log(req.body) 

  try {
    await Accessory.create({
      title,
      category,
      description,
      image: req.imagePath,
      price: Number(price),
      stock: Number(stock)
    })
    return res.status(200).json({ message: 'Accessories added succesfully' });
    
  } catch (err) {
    fs.unlink(`.${req.imagePath}`, (err) => {
      // console.log(err);
    });
    return res.status(400).json({ message: `${err}` });
    
  }
}

export const removeAccessories=async (req,res)=>{
  const {id}=req.params;

  try {
    if(mongoose.isValidObjectId(id)){
        const isExist=await Accessory.findById(id)
        if(isExist){
          await Accessory.deleteOne();
          fs.unlink(`.${isExist.image}`, (err) => {

          });
          return res.status(200).json({ message: 'succesfully deleted' });
        }

    }
    return res.status(400).json({ message: 'please provide valid id' });
  } catch (err) {
    return res.status(400).json({ error: `${err}` });
  }

}

export const updateAccessories=async (req,res)=>{
  const {id}=req.params;
  try {
    if(mongoose.isValidObjectId(id)){
      const isExist=await Accessory.findbyId(id);
      if(isExist){
        const updateObj = {
          title: req.body.title || isExist.title,
          category: req.body.category || isExist.category,
          description: req.body.description || isExist.description,
          stock: Number(req.body.stock) || isExist.stock,
          price: Number(req.body.price) || isExist.price,
        };
        if (req.imagePath) {
          await isExist.updateOne({
            ...updateObj,
            image: req.imagePath
          });
          fs.unlink(`.${isExist.image}`, (err) => {
  
          });
        } else {
          await isExist.updateOne(updateObj);
        }
        return res.status(200).json({ message: 'succesfully updated' });
  
      }
    }
    if (req.imagePath) fs.unlink(`.${req.imagePath}`, (err) => {

    });
    return res.status(400).json({ message: 'please provide valid id' });  
    
  } catch (err) {
    if (req.imagePath) fs.unlink(`.${req.imagePath}`, (err) => {

    });
    return res.status(400).json({ message: `${err}` });
  }
    
  }
  

  export const addReview=async (req,res)=>{
    const{id}=req.params;
    const { rating, comment } = req.body;
    try {
      if (mongoose.isValidObjectId(id)) {
        const isExist = await Accessory.findById(id);
        if (isExist) {
  
          // check if review already submitted
          if (isExist.reviews.find((rev) => rev.user.toString() === req.userId)) {
            return res.status(400).json({ message: 'you already submitted a review' });
          }
  
  
          const review = {
            user: req.userId,
            rating: Number(rating),
            comment
          }
          // add review
          isExist.reviews.push(review);
  
          // calculate avg rating
          const totalRating = isExist.reviews.reduce((prev, item) => prev + item.rating, 0);
          const avg = totalRating / isExist.reviews.length;
          isExist.rating = avg;
  
          // save
          await isExist.save();
  
          return res.status(200).json({ message: 'review added successfully' });
        }
      }
      return res.status(400).json({ message: 'please provide valid id' });
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }
  } 


 




