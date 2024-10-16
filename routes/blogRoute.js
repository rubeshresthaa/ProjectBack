import express from 'express';
import expressJoi from 'express-joi-validation';
import Joi from 'joi';
import { addBlog, getBlogs, removeBlog } from '../controllers/blogContoller.js';
import { notAllowed } from '../utils/showError.js';
import { adminCheck, checkUser } from '../middlewares/checkUser.js';
import { validFile } from '../middlewares/validFiles.js';

const validate=expressJoi.createValidator({})

export const schemaBlog=Joi.object({
  title:Joi.string().required(),
  author:Joi.string().required(),
  description:Joi.string().max(255).required()
})

const router=express.Router();

router.route('/').get(getBlogs).all(notAllowed);
router.route('/add-blog').post(validate.body(schemaBlog),checkUser,validFile,adminCheck,addBlog).all(notAllowed);
router.route('/blogs/:id').delete(removeBlog).all(notAllowed)

export default router;

