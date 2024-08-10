import express from 'express'
import { protect } from'../middleware/authmiddleware'
import {userRegister,authUser, allUsers} from "../controllers/userController"


export const userRouter=express.Router();

userRouter.route('/').post(userRegister);

userRouter.route('/login').post(authUser).get(protect,allUsers);

