import mongoose from 'mongoose'
import {Product} from '../models/Product.js'
import fs from 'fs';

export const getProduct = async (req,res)=>{
  try {
    const excludeType=['sort','fields','page','search','limit']

    const queryObject={...req.query}

    excludeType.forEach((q)=>{
      delete queryObject[q]
    })

    if (req.query.search) {
      queryObject.title = { $regex: req.query.search, $options: 'i' }
    }
 //converting object into string
    let qstr=JSON.stringify(queryObject)
    qstr = qstr.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);
    //converting string back to object
    let query=Product.find(JSON.parse(qstr))

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
const length = await Product.countDocuments();

return res.status(200).json({
  products,
  length
});

  
  } catch(err){
    return res.status(400).json({error:`$${err}`})

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