import express from 'express';
import expressJoi from 'express-joi-validation';
import Joi from 'joi';
import { getUsers, registerUser, updateUser, userLogin } from '../controllers/userController.js';
import { notAllowed } from '../utils/showError.js';
import { checkUser } from '../middlewares/checkUser.js';


const validate=expressJoi.createValidator({});

export const registerSchema=Joi.object({
  fullname:Joi.string().required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(5).max(15).required()
})

export const loginSchema=Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(5).max(15).required()
})

const router=express.Router()

router.route('/').get(getUsers).all(notAllowed);
router.route('/login').post(validate.body(loginSchema),userLogin).all(notAllowed)
router.route('/register').post(validate.body(registerSchema),registerUser).all(notAllowed)
router.route('/:id').patch(checkUser,updateUser).all(notAllowed)  

export default router;
