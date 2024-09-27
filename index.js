import express from "express";
import mongoose from "mongoose";
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import fileUpload from "express-fileupload";

const port=5000;

const app=express();

app.use(express.json());

mongoose.connect('mongodb+srv://rubeshshrestha213:Fantasy.1@cluster0.2qe1d4m.mongodb.net/Pawstore').then((val)=>{
  app.listen(port,(e)=>{
    console.log('connected')
  })
}).catch((err)=>{
  console.log(err)
})

app.get('/',(req,res)=>{
  return res.status(200).json({data:'Hello'})

})

app.use('/uploads', express.static('uploads'))
app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 },
  abortOnLimit: true
}));

app.use('/api/users',userRoute)
app.use('/api/products',productRoute)