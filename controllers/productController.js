import mongoose from 'mongoose'
import {Product} from '../models/Product.js'
import fs from 'fs';

export const getProduct = async (req, res) => {
  try {
    const excludeObj = ['sort', 'page', 'search', 'fields', 'limit'];

    const queryObj = { ...req.query };
    console.log("Query Object:", queryObj);

    excludeObj.forEach((q) => {
      delete queryObj[q];
    });

    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: 'i' };
    }

    // Debugging: Log the query object
    console.log("Query Object:", queryObj);

    let qStr = JSON.stringify(queryObj);
    qStr = qStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(qStr));

    if (req.query.sort) {
      const sorting = req.query.sort.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');
      query.sort(sorting);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join('').trim().split(/[\s,\t,\n]+/).join(' ');
      query.select(fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    // Get filtered products
    const products = await query.skip(skip).limit(limit);

    // Get count of products that match the search criteria
    const length = await Product.countDocuments(JSON.parse(qStr));

    // Debugging: Log the results
    console.log("Products Found:", products);
    console.log("Total Count of Products:", length);

    return res.status(200).json({
      products,
      length,
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};


  export const getProductById=async (req,res)=>{
    const {id}=req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      const product=await Product.findById(id).select('-createdAt -updatedAt -__v').populate({
        path: 'reviews.user',
        select: 'fullname email'
      });
      // const product=await Product.findById(id).select('-createdAt -updatedAt -__v')
      res.status(200).json(product)
    } catch (err) {
      res.status(400).json({error:`${err}`})
      
    }

  }


export const addProduct=async (req,res)=>{
  const{title,description,breeds,category,price,stock}=req.body;

  try {
    await Product.create({
      title,
      description,
      category,
      breeds,
      image:req.imagePath,
      price:Number(price),
      stock:Number(stock)
    })
    return res.status(200).json({message:'SuccessFully Added'})
    
  } catch (err) {
    fs.unlink(`.${req.imagePath}`, (err)=>{

    })
    return res.status(400).json({error:`$err`})
  }

}

export const updateProduct=async (req,res)=>{
  const {id}=req.params;
  try {
    if(mongoose.isValidObjectId(id)){
      const isExist=await Product.findById(id);
      if(isExist){
        const updateObj={
          title:req.body.title || isExist.title,
          description:req.body.description || isExist.description,
          breeds:req.body.breeds || isExist.breeds,
          price:Number(req.body.price) || isExist.price,
          category:req.body.category || isExist.category,
          stock:Number(req.body.stock) || isExist.stock
        };
        if(req.imagePath){
          await isExist.updateOne({
            ...updateObj,
            image:req.imagePath
          });
          fs.unlink(`.${isExist.image}`,(err)=>{

          });
        }else{
          await isExist.updateOne(updateObj);
        }
        return res.status(200).json({ message: 'succesfully updated' });
      }
    }

    if(req.imagePath) fs.unlink(`.${req.imagePath}`,(err)=>{

    });
    return res.status(400).json({ message: 'please provide valid id' });
    
  } catch (err) {
    if (req.imagePath) fs.unlink(`.${req.imagePath}`, (err) => {

    });
    return res.status(400).json({ message: `${err}` });
  }
    
  }

  export const removeProduct=async (req,res)=>{
    const {id}=req.params;
    try {
      if(mongoose.isValidObjectId(id)){
        const isExist=await Product.findById(id)
        if(isExist){
          await Product.deleteOne();
          fs.unlink(`.${isExist.image}`,(err)=>{

          });
          res.status(200).json({message:'Successfully Deleted'})
        }
      }
      res.status(400).json({message:'Please Provide valid Id'})
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }

  }

  export const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
  
    try {
      if (mongoose.isValidObjectId(id)) {
        const isExist = await Product.findById(id);
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