import { ChatType, UserType } from "../CommonTypes";
import { Request,Response } from "express-serve-static-core";
import Chat from "../models/chatmodel";
import User from "../models/usermodel";
import { Document } from "mongoose";
import Message from "../models/messagemodel";


const accessChat = async (req: Request<{},any,{userId:string}>, res:Response ) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send('UserId param not sent with request');
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user?._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    let resisChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    if (resisChat.length > 0) {
      res.send(resisChat[0]);
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user?._id, userId],
      };
      const createdChat = await Chat.create(chatData);
      let fullChat:(Document<unknown, {}, ChatType> & ChatType & Required<{
        _id: string;
    }>)[] | (Document<unknown, {}, UserType> & UserType & Required<{
      _id: string;
  }>)[]= await Chat.find({ _id: createdChat._id })
        .populate('users', '-password')
        .populate('latestMessage');

      fullChat = await User.populate(fullChat, {
        path: 'latestMessage.sender',
        select: 'name pic email',
      });
      res.status(200).json(fullChat[0]);
    }
  } catch (error: any) {
    res.status(400).json({error:error.message});
  }
}

const fetchChats = async (req: Request, res: Response) => {
  try {
    const chatData = await Chat.find({ users: { $elemMatch: { $eq: req.user?._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    const fullChatData = await User.populate(chatData, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });
    res.status(200).json(fullChatData);
  } catch (err: any) {
    res.status(400).json({error:err.message});
  }
}
type CreateGroupChatReqBody={
  users:UserType[],
  name: string
}
const createGroupChat = async (req: Request<{},any,CreateGroupChatReqBody>, res: Response) => {
  try {
    if (!(req.body.users && req.body.name)) {
      res.status(400);
      throw new Error('Please provide both the chat name and the users for the group chat');
    }
    const users = req.body.users;
    if (users.length < 2) {
      return res.status(400).send('More than 2 users are required to form a group chat');
    }
    users.push(req.user as UserType);

    const newGroupChat = await Chat.create({
      isGroupChat: true,
      chatName: req.body.name,
      groupAdmin: req.user?._id,
      users,
    });

    const fullChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).json(fullChat);
  } catch (err: any) {
    res.status(400).json({error:err.message});
  }
};

const renameGroup = async (req: Request, res: Response) => {
  const { chatname, chatid } = req.body;
  const chatUpdated = await Chat.findByIdAndUpdate(
    chatid,
    { chatName: chatname },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage');
    let chatobj=await User.populate(chatUpdated,{
      path: 'latestMessage.sender',
      select: 'name pic email',
    });
    if (!chatUpdated) {
    return res.status(400).send('Chat not found');
  }
  res.status(200).json(chatobj);
}

const removeGroup = async (req: Request, res: Response) => {
  const { userid, chatid } = req.body;
  const chatUpdated = await Chat.findByIdAndUpdate(
    chatid,
    { $pull: { users: userid } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage');
    let chatobj=await User.populate(chatUpdated,{
      path: 'latestMessage.sender',
      select: 'name pic email',
    });
  if (!chatUpdated) {
    return res.status(400).send('Chat not found');
  }
  res.status(200).json(chatobj);
}

const addGroup = async (req: Request, res: Response) => {
  const { userid, chatid } = req.body;
  const chatUpdated = await Chat.findByIdAndUpdate(
    chatid,
    { $push: { users: userid } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage');
    let chatobj=await User.populate(chatUpdated,{
      path: 'latestMessage.sender',
      select: 'name pic email',
    })
    console.log(chatobj)
  if (!chatUpdated) {
    return res.status(400).send('Chat not found');
  }
  res.status(200).json(chatobj);
}

const deleteChatPermanently=async (req:Request<{},{chatid:string,userid:string}>,res: Response)=>
{
  const {chatid,userid}=req.body;
  const checkifadmin:ChatType|null=await Chat.findById(chatid).where('groupAdmin').equals(userid);
  if(checkifadmin===null)
  {
    res.status(403).send('A non-group admin cannot delete the group');
  }
  const chatdeleted = await Chat.findByIdAndDelete(chatid);
  await Message.deleteMany({chat: chatid});
  res.status(200).json({chatdeleted});
}
export { accessChat, fetchChats, createGroupChat, renameGroup, removeGroup, addGroup,deleteChatPermanently };