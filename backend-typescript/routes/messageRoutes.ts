
import express from 'express'
import { protect } from'../middleware/authmiddleware'
import { allMessages, sendMessages } from '../controllers/messageController'
export const MessageRouter=express.Router();

MessageRouter.get("/:chatid",protect,allMessages);
MessageRouter.post('/',protect,sendMessages);

