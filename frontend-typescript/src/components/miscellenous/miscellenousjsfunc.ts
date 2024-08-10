import { Message } from "CommonTypes";

export const isSameSenderMargin = (messages: Message[], m:Message, i:number, userId:string) => {
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (messages:Message[], m:Message, i:number, userId: string) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages:Message[], i:number, userId:string) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  
  export const isSameUser = (messages:Message[], m:Message, i:number) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  
  // export const getSender = (loggedUser:, users) => {
  //   return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  // };
  
  // export const getSenderFull = (loggedUser, users) => {
  //   return users[0]._id === loggedUser._id ? users[1] : users[0];
  // };