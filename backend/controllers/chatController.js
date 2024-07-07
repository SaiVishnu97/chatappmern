const asyncHandler = require('express-async-handler');

const Chat=require('../models/ChatModel');
const User=require("../models/UserModel");
const accessChat=asyncHandler(async(req,res)=>{
  try{
    const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

    console.log(isChat);
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
      const createdChat = await Chat.create(chatData);
      let FullChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-password"
      ).populate("latestMessage");
      FullChat=await User.populate(FullChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).json(FullChat[0]);
    }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  
})

const fetchChats=asyncHandler(async(req,res)=>{
  try
  {
    var chatData=await Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({updatedAt:-1});
    chatData=await User.populate(chatData, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(chatData);
  }catch(err){
    res.status(400);
    throw new Error(err.message);
  }
});

const createGroupChat=asyncHandler(async(req,res)=>{
  try
  {
    if(!(req.body.users&&req.body.name))
    {
      res.status(400);
      throw new Error("Please provide both the chat name and the users for the group chat");
    }
    let users =req.body.users;
    // console.log(users)
    if(users.length<2)
    {
      return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);

    const newgroupchat=await Chat.create({
      isGroupChat: true,
      chatName: req.body.name,
      groupAdmin: req.user._id,
      users
    });
    let fullchat=await Chat.findOne({_id:newgroupchat._id})
                         .populate("users","-password")
                         .populate("groupAdmin","-password");
    res.status(200).json(fullchat);
    
  }
  catch(err)
  {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup=asyncHandler(async(req,res)=>{
  const {chatname,chatid}=req.body;
  const chatupdated=await Chat.findByIdAndUpdate(chatid,{
    chatName: chatname
  },{
    new : true
  })
  .populate("users","-password")
  .populate("groupAdmin","-password");
  if(!chatupdated)
  {
    return res.status(400).send("Chat not found");
  }
  res.status(200).json(chatupdated);
});

const removeGroup=asyncHandler(async(req,res)=>{
  const {userid,chatid}=req.body;
  const chatupdated=await Chat.findByIdAndUpdate(chatid,{
    $pull:{users: userid}
  },{
    new : true
  })
  .populate("users","-password")
  .populate("groupAdmin","-password");
  if(!chatupdated)
  {
    return res.status(400).send("Chat not found");
  }
  res.status(200).json(chatupdated);
});
const addGroup=asyncHandler(async(req,res)=>{
  const {userid,chatid}=req.body;
  const chatupdated=await Chat.findByIdAndUpdate(chatid,{
   $push:{users: userid}
  },{
    new : true
  })
  .populate("users","-password")
  .populate("groupAdmin","-password");
  if(!chatupdated)
  {
    return res.status(400).send("Chat not found");
  }
  res.status(200).json(chatupdated);
});
module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addGroup,removeGroup}