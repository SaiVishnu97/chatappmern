import { MessageType } from "../CommonTypes";
import mongoose from "mongoose";

const messageModel=new mongoose.Schema<MessageType>({
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    content:{
        type: String,
        trim: true
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats'
    }
},{
    timestamps: true
});
const Message=mongoose.model<MessageType>('Messages',messageModel);
export default Message