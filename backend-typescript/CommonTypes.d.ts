// types/express.d.ts
import * as express from 'express';
import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: UserType|null
    }
  }
  // namespace expressAsyncHandler {
  //   interface Request {
  //     [key: string]: string;
  //     user: UserType&{
  //       createdAt: Date;
  // updatedAt: Date;
  //     }
  //   }

}
export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
  matchPassword(enteredPassword: string)
}

export interface MessageType extends Document{
  _id: string;
  chat: ChatType;
  content: string;
  sender: UserType;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChatType extends Document{
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserType[];
  latestMessage: MessageType;
  groupAdmin: UserType;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CurrentUserType extends UserType
{
  token: string
}


export interface ServerToClientEvents {

  ConnectionEstablishmentFromTheServer:()=> void;
  ChatConnectionAcknowledgement: ()=>void;
  OthersTyping: (currentuser: CurrentUserType,currentchat: ChatType)=>void;
  OthersStopTyping: (currentuser: CurrentUserType)=> void;
  MessageReceived: (messagedetails: MessageType,senderchat: ChatType)=> void;
  adminDeletedChat: (adminname: string,deletedchat: ChatType)=>void;
}

export interface ClientToServerEvents {
  userSetup: (userid:string) => void;
  isTyping: (currentchatwithuser: string)=> void;
  stopTyping: (currentchatwithuser: string)=>void;
  newMessageSent: (wholemessagewithchat: string)=>void;
  groupChatDeleted: (currentchatwithuser: string)=>void;
}

interface SocketData {
  name: string;
  _id: string;
}



