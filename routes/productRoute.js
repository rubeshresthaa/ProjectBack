import express from 'express';
import {addProduct, getProduct, getProductById, removeProduct, updateProduct} from '../controllers/productController.js';
import { adminCheck, checkUser } from '../middlewares/checkUser.js';
import {updateFile, validFile} from '../middlewares/validFiles.js'
import {notAllowed} from '../utils/showError.js'


const router=express.Router();


router.route('/').get(getProduct).post(checkUser,validFile,adminCheck,addProduct).all(notAllowed)
router.route('/:id').get(getProductById).patch(checkUser,adminCheck,updateFile,updateProduct).delete(checkUser,adminCheck,removeProduct).all(notAllowed);

export default router;