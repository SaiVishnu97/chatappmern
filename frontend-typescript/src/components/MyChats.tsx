import React from 'react'
import "./components.css"
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { addNewProperties, reShuffleMyChats, useAppDispatch, useAppSelector } from 'state';
import {ChatsListItem,GroupChatsListItem} from './miscellenous/ChatsListItem';
import Button from './Elements/Button';
import GroupChatModal from './miscellenous/GroupChatModal';
import { Chat, User,Message, } from 'CommonTypes';
import EventEmitter from 'events';
import { socket } from 'Pages/ChatPage';

export const messageevent=new EventEmitter();
type MyChatsProps={
  selectallchats: boolean,
  setSelectAllChats:React.Dispatch<React.SetStateAction<boolean>>
}

const MyChats:React.FC<MyChatsProps> = ({setSelectAllChats}) => {
  const mychats=useAppSelector((state)=>state.chatapp.mychats);
  const dispatch=useAppDispatch();
  const currentuserdetails=React.useMemo(()=>JSON.parse(localStorage.getItem('userinfo') as string),[]);
  const toast=useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCurrentUserChats=async ()=>{
    try{
      const currentuserdetails:User&{token:string}=JSON.parse(localStorage.getItem('userinfo') as string);
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
      const results=await axios.get("/api/chats",config);
      if(results.status>=400)
        throw new Error("Invalid chats")
      dispatch(addNewProperties({mychats:results.data}));

    }catch(err:any)
    {
        toast({
            title: 'Error while fetching the chats',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top'
          });
    }
    
  }
  const handleMessageReceiving=(messagedetails: Message,senderchat: Chat)=>{
    if(messagedetails.sender._id!==currentuserdetails._id)
    {
      const updatedcurrentchat=JSON.parse(JSON.stringify(senderchat))
        updatedcurrentchat.latestMessage=messagedetails;
        dispatch(reShuffleMyChats(updatedcurrentchat));
        messageevent.emit('MessageReceived',messagedetails,senderchat)
    }
   }
  React.useEffect(()=>{
    fetchCurrentUserChats();
    socket.on('MessageReceived',handleMessageReceiving);

    return ()=>{
      socket.off('MessageReceived',handleMessageReceiving);
    }
  },[])
  
  return (
    <>
    <div className='MyChats'>
      <div className='MyChatsHeader'>
        <span style={{fontSize:'1.5em',fontWeight:'500'}}>
        My Chats
        </span>
        <Button onClick={onOpen}>New Group Chat +</Button>
        <GroupChatModal onClose={onClose} isOpen={isOpen}/>
      </div>
      <div className='MyChatsList'>
      
      {mychats&&mychats.map((val)=>{
        if(!val.isGroupChat)
        return <ChatsListItem key={val._id} chatdetails={val} setSelectAllChats={setSelectAllChats}/>
        return <GroupChatsListItem key={val._id} groupchatdetails={val} setSelectAllChats={setSelectAllChats}/>})
        }
    </div>
    </div>
    </>
  )
}

export default MyChats