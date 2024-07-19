
const express=require('express');
const { allMessages, sendMessages } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddlewares');
const Router=express.Router();

Router.get("/:chatid",protect,allMessages);
Router.post('/',protect,sendMessages);

module.exports=Router;