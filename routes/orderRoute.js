import express from "express";
import { checkUser } from "../middlewares/checkUser.js";
import { addOrder, getOrderById, getOrderByUser } from "../controllers/orderController.js";
import { notAllowed } from "../utils/showError.js";



const router = express.Router();


router.route('/').post(checkUser, addOrder).all(notAllowed);
router.route('/users').get(checkUser, getOrderByUser).all(notAllowed);
router.route('/:id').get(getOrderById).all(notAllowed);



export default router;