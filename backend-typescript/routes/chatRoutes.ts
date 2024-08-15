import express from 'express'
import { protect } from'../middleware/authmiddleware'
import { accessChat, fetchChats, createGroupChat, renameGroup, addGroup, removeGroup, deleteChatPermanently } from '../controllers/chatController';

export const ChatRouter=express.Router();

ChatRouter.route("/").post(protect,accessChat).get(protect,fetchChats);
ChatRouter.route("/group").post(protect,createGroupChat);
ChatRouter.route("/rename").post(protect,renameGroup);
ChatRouter.route("/add").post(protect,addGroup);
ChatRouter.route("/remove").post(protect,removeGroup);
ChatRouter.route('/deletechat').delete(protect,deleteChatPermanently);

