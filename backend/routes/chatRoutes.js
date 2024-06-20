const express=require('express');
const { protect } = require('../middlewares/authMiddlewares');
const { accessChat, fetchChats, createGroupChat, renameGroup, addGroup, removeGroup } = require('../controllers/chatController');

const ChatRouter=express.Router();

ChatRouter.route("/").post(protect,accessChat).get(protect,fetchChats);
ChatRouter.route("/group").post(protect,createGroupChat);
ChatRouter.route("/rename").post(protect,renameGroup);
ChatRouter.route("/add").post(protect,addGroup);
ChatRouter.route("/remove").post(protect,removeGroup);

module.exports={ChatRouter};