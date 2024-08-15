import Message from "../models/messagemodel"
import User from "../models/usermodel"
import Chat from "../models/chatmodel";
import { Request ,Response} from "express-serve-static-core";

export const sendMessages=async(req: Request,res: Response)=>{
    try {
        const {chatid,content}=req.body;
        if(!chatid||!content)
        {
            throw new Error('Invalid request');
        }
        let messageobj={
            sender:req.user?._id,
            content,
            chat:chatid,
        }
        let message=await Message.create(messageobj);
        message=await message.populate('chat');
        message=await message.populate('sender',"name pic email");
       let finalmessage=await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        });
        await Chat.findByIdAndUpdate(chatid,{latestMessage:finalmessage._id});
        res.status(200).json(finalmessage);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
}

export const allMessages=async(req: Request,res: Response)=>{
  try {
    const {chatid} = req.params;
    const allmessages=await Message.find({chat:chatid})
                                   .populate('sender','name email pic')
                                   .populate('chat');
    res.json(allmessages);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

