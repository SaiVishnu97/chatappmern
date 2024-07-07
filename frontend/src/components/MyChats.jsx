import React from 'react'
import "./components.css"
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProperties } from 'state';
import {ChatsListItem,GroupChatsListItem} from './miscellenous/ChatsListItem';
import Button from './Elements/Button';
import GroupChatModal from './miscellenous/GroupChatModal';

const MyChats = () => {
  const mychats=useSelector((state)=>state.chatapp.mychats);
  const dispatch=useDispatch();
  const toast=useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCurrentUserChats=async ()=>{
    try{
      const currentuserdetails=JSON.parse(localStorage.getItem('userinfo'));
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
      const results=await axios.get(process.env.REACT_APP_BACKENDURL+"/api/chats",config);
      if(results.status>=400)
        throw new Error("Invalid chats")
      dispatch(addNewProperties({mychats:results.data}));
      // const frienduser=results.data[0].users.filter((val)=>val.email!==currentuserdetails.email)[0];
      
      // dispatch(addNewProperties({frienduser}));

    }catch(err)
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
  React.useEffect(()=>{
    fetchCurrentUserChats();
  },[])
  return (
    <div className='MyChats'>
      <div className='MyChatsHeader'>
        <span style={{fontSize:'1.5em',fontWeight:'500'}}>
        My Chats
        </span>
        <Button onClick={onOpen}>New Group Chat +</Button>
        <GroupChatModal onClose={onClose} isOpen={isOpen}/>
      </div>
      <div className='MyChatsList'>
      
      {Boolean(mychats)&&mychats.map((val)=>{
        if(!val.isGroupChat)
        return <ChatsListItem chatdetails={val}/>
        return <GroupChatsListItem groupchatdetails={val}/>})
        }
    </div>
    </div>
    
  )
}

export default MyChats