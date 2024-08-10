import { ChatType } from "../CommonTypes";
import mongoose from "mongoose";
const chatModel=new mongoose.Schema<ChatType>({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    users: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    latestMessage: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    },
    groupAdmin:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},{
    timestamps: true
});
const Chat=mongoose.model<ChatType>('Chats',chatModel);
export default Chat

