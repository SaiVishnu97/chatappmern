export interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    isAdmin: boolean;
}
  
export interface Message {
    _id: string;
    chat: Chat;
    content: string;
    sender: User;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
  
export interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: User[];
    latestMessage: Message;
    groupAdmin: User;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CurrentUser extends User
{
    token: string
}


export interface ServerToClientEvents {

    ConnectionEstablishmentFromTheServer:()=> void;
    ChatConnectionAcknowledgement: ()=>void;
    OthersTyping: (currentuser: CurrentUser,currentchat: Chat)=>void
    OthersStopTyping: (currentuser: CurrentUser)=> void
    MessageReceived: (messagedetails: Message,senderchat: Chat)=> void
  }
  
  export interface ClientToServerEvents {
    userSetup: (userid:string) => void;
    isTyping: (currentchatwithuser: string)=> void;
    stopTyping: (currentchatwithuser: string)=>void;
    newMessageSent: (wholemessagewithchat: string)=>void;
  }
  