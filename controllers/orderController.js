import mongoose from "mongoose";
import { Order } from "../models/Order.js";

export const addOrder =async (req,res)=>{
  const {totalAmount,breeds,accessories}=req.body;
  try {
    await Order.create({
      totalAmount,
      breeds,
      accessories,
      userId:req.userId
    });
    return res.status(200).json('added succesfully');
    
  } catch (err) {
    return res.status(400).json(`${err}`);
  }

}

export const getOrderByUser = async (req, res) => {

  try {
    if (req.isAdmin) {
      const orders = await Order.find({}).sort('-createdAt');
      return res.status(200).json(orders);
    } else {
      const orders = await Order.find({ userId: req.userId });
      return res.status(200).json(orders);
    }


  } catch (err) {
    return res.status(400).json(`${err}`);
  }
}

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.isValidObjectId(id)) {
      const order = await Order.findById(id)
        .populate('breeds.product') // Make sure this references the correct collection
        .populate('accessories.accessory') // Make sure this references the correct collection
        .populate({
          path: 'userId', // Ensure this matches the field in your Order schema
          select: 'fullname email',
          model: 'Users' // Specify the model name if it's not the default
        });

      if (!order) {
        return res.status(404).json('Order not found'); 
      }

      return res.status(200).json(order);
    } else {
      return res.status(400).json('Please provide a valid ID');
    }
  } catch (err) {
    console.error("Error fetching order by ID:", err); // Log the error for debugging
    return res.status(500).json(`Server error: ${err.message}`);
  }
};

