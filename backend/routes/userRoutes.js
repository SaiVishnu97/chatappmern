const express = require('express');
const {userRegister,authUser, allUsers} =require("../controllers/userController");

const {generateToken} = require('../config/config');
const { protect } = require('../middlewares/authMiddlewares');

const Router=express.Router();

Router.route('/').post(userRegister);

Router.route('/login').post(authUser).get(protect,allUsers);

module.exports={
    userRouter:Router
}