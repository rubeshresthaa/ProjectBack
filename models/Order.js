import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  breeds: [
    {
      qty: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Ensure this model is defined too
      },
    },
  ],
  accessories: [
    {
      accessory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accessory', // Reference to the singular Accessory model
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Ensure this model is defined too
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
