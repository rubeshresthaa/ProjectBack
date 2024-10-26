import express from 'express';
import { addAccessories, addReview, getAccessories, getAccessoriesById, removeAccessories, updateAccessories } from '../controllers/accessoriesController.js';
import { notAllowed } from '../utils/showError.js';
import { updateFile, validFile } from '../middlewares/validFiles.js';
import { adminCheck, checkUser } from '../middlewares/checkUser.js';

const router=express.Router();

router.route('/').get(getAccessories).post(validFile,addAccessories).all(notAllowed)

router.route('/reviews/:id').post(checkUser,addReview).all(notAllowed);

router.route('/:id').get(getAccessoriesById).post(checkUser,validFile,adminCheck,updateFile,removeAccessories,updateAccessories).all(notAllowed)

export default router;