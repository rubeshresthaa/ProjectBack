import express from 'express';
import {addProduct, getProduct} from '../controllers/productController.js';
import { adminCheck, checkUser } from '../middlewares/checkUser.js';
import {validFile} from '../middlewares/validFiles.js'
import {notAllowed} from '../utils/showError.js'


const router=express.Router();


router.route('/').get(getProduct).post(checkUser,validFile,adminCheck,addProduct).all(notAllowed)

export default router;