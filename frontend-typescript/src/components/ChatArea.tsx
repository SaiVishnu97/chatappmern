import React from 'react'
import './components.css'
import StyledInput from './Elements/StyledInput'
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import ScrollableMessage from './ScrollableMessage';
import { updateChatData, useAppDispatch, useAppSelector } from 'state';
import { Chat, Message, User } from 'CommonTypes';
import { messageevent } from './MyChats';
import { socket } from 'Pages/ChatPage';

// let socket:Socket<ServerToClientEvents, ClientToServerEvents>=io(process.env.REACT_APP_BACKENDURL as string);

const ChatArea = () => {
  const [newmessage,setNewMessage]=React.useState("");
  const [allmessages,setAllMessages]=React.useState<Message[]>([]);
  const [typinguser,setTypingUser]=React.useState<null|User>(null);
  const currentuserdetails=JSON.parse(localStorage.getItem('userinfo') as string);
  const dispatch=useAppDispatch();
  const currentchat=useAppSelector((state)=>(state.chatapp.currentchat as Chat))
  const toast=useToast();
  const previoustime=React.useRef(Date.now());
  const handleInput=(event: React.ChangeEvent<HTMLInputElement>)=>{
     setNewMessage(event.target.value );
     socket.emit('isTyping',JSON.stringify({currentchat,currentuser:currentuserdetails}));
     const timeout=3000;
     previoustime.current=Date.now();
     setTimeout(()=>{
      let currenttime=Date.now();
      if(currenttime-previoustime.current>=timeout)
      {
        socket.emit('stopTyping',JSON.stringify({currentchat,currentuser:currentuserdetails}));
      }
      },timeout)
  }
  const handleStopTyping=()=>{
    console.log("Others stopped typing")
    setTypingUser(null)}
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
      socket.emit('newMessageSent',JSON.stringify({currentchat:updatedcurrentchat,messagedetails:result.data}))
      setAllMessages([...allmessages,result.data]);
    } catch (error: any) {
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
  const handleMessageReceiving=(messagedetails: Message,senderchat: Chat)=>{
     if(messagedetails.chat._id===currentchat._id&&messagedetails.sender._id!==currentuserdetails._id)
    {
        setAllMessages((prevstate)=>[...prevstate,messagedetails]);
    }
  }
  const handleOthersTyping=(typinguser: User,typingchat: Chat)=>{
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
    } catch (error: any) {
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
    socket.on('ChatConnectionAcknowledgement',()=>console.log('Chat connection acknowlegement'));

    messageevent.on('MessageReceived',handleMessageReceiving);
    socket.on('OthersTyping',handleOthersTyping);
    socket.on('OthersStopTyping',handleStopTyping);
    return ()=>{
      messageevent.off('MessageReceived',handleMessageReceiving);
    }
    
  },[currentchat._id]);
  return (
    <>
    <div className='chatarea'>
    <ScrollableMessage messages={allmessages} currentchatid={currentchat._id} typinguser={typinguser}/>
    </div>

    <div className="chatbox-input">
      <StyledInput type="text" placeholder="Type a message..." className='InputStyles' onChange={handleInput} onKeyDown={(event)=>{if(event.keyCode===13)handleMessageSending()}} value={newmessage}/>
      <i className="fa-solid fa-paper-plane fa-xl sendicon" onClick={handleMessageSending}></i>

        </div>
    </>
    
  )
}

export default ChatArea