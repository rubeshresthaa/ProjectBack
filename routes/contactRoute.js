import Joi from "joi"
import express from 'express';
import { getContact, removeContact, submitContact } from "../controllers/contactController.js";
import { notAllowed } from "../utils/showError.js";
import expressJoi from 'express-joi-validation';

const validate=expressJoi.createValidator({})

export const schemaContact=Joi.object({
  fullname:Joi.string().required(),
  email:Joi.string().email().required(),
  subject:Joi.string().max(255).required()
})

const router=express.Router();

router.route('/').get(getContact).all(notAllowed)
router.route('/contact-submit').post(validate.body(schemaContact),submitContact).all(notAllowed)
router.route('/:id').delete(removeContact);

export default router;  