// models/Accessory.js
import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Bowls & Feeding', 'Clean Up', 'Collars', 'Dog Wear', 'Grooming', 'Toys', 'Utilis & Training'],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Ensure this matches your user model name
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
}, { timestamps: true });

export const Accessory = mongoose.model('Accessory', accessorySchema); 
