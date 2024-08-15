const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

const sendMessages=expressAsyncHandler(async(req,res)=>{
    try {
        const {chatid,content}=req.body;
        if(!chatid||!content)
        {
            throw new Error('Invalid request');
        }
        let messageobj={
            sender:req.user._id,
            content,
            chat:chatid,
        }
        let message=await Message.create(messageobj);
        message=await message.populate('chat');
        message=await message.populate('sender',"name pic email");
        message=await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        });
        await Chat.findByIdAndUpdate(chatid,{latestMessage:message._id});
        res.status(200).json(message);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

const allMessages=expressAsyncHandler(async(req,res)=>{
  try {
    const {chatid} = req.params;
    const allmessages=await Message.find({chat:chatid})
                                   .populate('sender','name email pic')
                                   .populate('chat');
    res.json(allmessages);
  } catch (error) {
    res.status(400).send(error.message);
  }
  
})

module.exports={
    sendMessages,
    allMessages
}