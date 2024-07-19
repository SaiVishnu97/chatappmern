import React from 'react'
import './components.css'
import StyledInput from './Elements/StyledInput'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import ScrollableMessage from './ScrollableMessage';
import { io } from 'socket.io-client';
const inputStyles = {
  padding: '10px',
  border: 'none',
  borderRadius: '10px',
  fontFamily: '"Roboto", sans-serif',
  outline: 'none',
  fontSize: '16px',
  width:'80vw',
  
};
let socket;
const ChatArea = () => {
  const [newmessage,setNewMessage]=React.useState("");
  const [allmessages,setAllMessages]=React.useState([]);
  const {currentchatid}=useSelector((state)=>state.chatapp);
  const currentuserdetails=JSON.parse(localStorage.getItem('userinfo'));
  const toast=useToast();
  const handleInput=(event)=>{
     setNewMessage(event.target.value);
  }
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
        chatid: currentchatid,
        content: newmessage
      }
      const result=await axios.post('/api/messages',reqbody,config);
      if(result.status>=400)
        throw new Error("Unable to send the message");
    
      setNewMessage('');
      socket.emit('new message sent',JSON.stringify({currentchatid,messagedetails:result.data}))
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
  const fetchAllMessages=async()=>{
    try {
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
     
      const result=await axios.get('/api/messages/'+currentchatid,config);
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
    socket=io(process.env.REACT_APP_BACKENDURL);
    
  },[]);
  React.useEffect(()=>{
    fetchAllMessages();
    socket.on('connection establishment from the server',()=>{
      socket.emit('User setup',currentchatid);
      console.log('connection establishment from the server')
    
    });
    socket.on('Chat connection acknowlegement',()=>console.log('Chat connection acknowlegement'));
    
  },[currentchatid]);
  React.useEffect(()=>{
    socket.on('Message received',()=>{
      console.log('Message received');
      fetchAllMessages();
    })
  })
  return (
    <>
    <div className='chatarea'>
    <ScrollableMessage messages={allmessages}/>

    
    </div>
    <div class="chatbox-input">
    <i className="fa-solid fa-paper-plane fa-xl sendicon" onClick={handleMessageSending}></i>
      <StyledInput type="text" placeholder="Type a message..." style={inputStyles} onChange={handleInput} onKeyDown={(event)=>{if(event.keyCode===13)handleMessageSending()}} value={newmessage}/>
        </div>
    </>
    
  )
}

export default ChatArea