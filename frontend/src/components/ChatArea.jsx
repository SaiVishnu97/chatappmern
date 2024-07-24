import React from 'react'
import './components.css'
import StyledInput from './Elements/StyledInput'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import ScrollableMessage from './ScrollableMessage';
import { io } from 'socket.io-client';
import { reShuffleMyChats, updateChatData } from 'state';

let socket=io(process.env.REACT_APP_BACKENDURL);

const ChatArea = () => {
  const [newmessage,setNewMessage]=React.useState("");
  const [allmessages,setAllMessages]=React.useState([]);
  const [typinguser,setTypingUser]=React.useState(null);
  const currentuserdetails=JSON.parse(localStorage.getItem('userinfo'));
  const dispatch=useDispatch();
  const currentchat=useSelector((state)=>state.chatapp.currentchat)
  const toast=useToast();
  const previoustime=React.useRef(new Date());
  const handleInput=(event)=>{
     setNewMessage(event.target.value);
     socket.emit('Is typing',JSON.stringify({currentchat,currentuser:currentuserdetails}));
     const timeout=3000;
     previoustime.current=new Date();
     setTimeout(()=>{
      let currenttime=new Date();
      if(currenttime-previoustime.current>=timeout)
      {
        socket.emit('stop typing',JSON.stringify({currentchat,currentuser:currentuserdetails}));
      }
      },timeout)
  }
  const handleStopTyping=()=>setTypingUser(null);
  const handleMessageSending=async()=>
  {
    if(Boolean(newmessage)===false)
      return;
    try {
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
      const reqbody={
        chatid: currentchat._id,
        content: newmessage
      }
      const result=await axios.post('/api/messages',reqbody,config);
      if(result.status>=400)
        throw new Error("Unable to send the message");
    
      setNewMessage('');
      const updatedcurrentchat=JSON.parse(JSON.stringify(currentchat))
      updatedcurrentchat.latestMessage=result.data;
      dispatch(updateChatData(updatedcurrentchat));
      socket.emit('new message sent',JSON.stringify({currentchat:updatedcurrentchat,messagedetails:result.data}))
      setAllMessages([...allmessages,result.data]);
    } catch (error) {
      toast({
        title: 'Error while sending a new message',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }
  const handleMessageReceiving=(messagedetails,senderchat)=>{
     if(messagedetails.chat._id===currentchat._id&&messagedetails.sender._id!==currentuserdetails._id)
    {
        setAllMessages((prevstate)=>[...prevstate,messagedetails]);
    }
    if(messagedetails.sender._id!==currentuserdetails._id)
    {
      const updatedcurrentchat=JSON.parse(JSON.stringify(senderchat))
        updatedcurrentchat.latestMessage=messagedetails;
        dispatch(reShuffleMyChats(updatedcurrentchat));
    }
  }
  const handleOthersTyping=(typinguser,typingchat)=>{
    if(typingchat._id===currentchat._id&&typinguser._id!==currentuserdetails._id)
      {
        setTypingUser({...typinguser});   
      }
  }
  const fetchAllMessages=async()=>{
    try {
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
     
      const result=await axios.get('/api/messages/'+currentchat._id,config);
      if(result.status>=400)
        throw new Error("Unable to fetch the chat messages");
       setAllMessages(result.data);
    } catch (error) {
      toast({
        title: 'Error while sending a new message',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }
  
  React.useEffect(()=>{
    fetchAllMessages();
    socket.on('connection establishment from the server',()=>{
      console.log('connection establishment from the server')
    
    });
    socket.on('Chat connection acknowlegement',()=>console.log('Chat connection acknowlegement'));
    socket.emit('User setup',currentuserdetails._id);

    socket.on('Message received',handleMessageReceiving);
    socket.on('Others typing',handleOthersTyping);
    socket.on('Others stop typing',handleStopTyping);
    return ()=>{
      socket.off('Message received',handleMessageReceiving);
    }
    
  },[currentchat._id]);
  return (
    <>
    <div className='chatarea'>
    <ScrollableMessage messages={allmessages} currentchatid={currentchat._id} typinguser={typinguser}/>
    </div>

    <div className="chatbox-input">
    <i className="fa-solid fa-paper-plane fa-xl sendicon" onClick={handleMessageSending}></i>
      <StyledInput type="text" placeholder="Type a message..." className='InputStyles' onChange={handleInput} onKeyDown={(event)=>{if(event.keyCode===13)handleMessageSending()}} value={newmessage}/>
        </div>
    </>
    
  )
}

export default ChatArea