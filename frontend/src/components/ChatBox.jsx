import React from 'react'
import "./components.css"
import ChatBoxHeader from './miscellenous/ChatBoxHeader'
import { useDispatch, useSelector } from 'react-redux'



const ChatBox = () => {
  const frienduser=useSelector((state)=>state.chatapp.frienduser);
  const groupchatdetails=useSelector(state=>state.chatapp.groupchatdata);
  return (
    <div className='ChatBox'>
    {Boolean(frienduser||groupchatdetails)&&<ChatBoxHeader frienduser={frienduser} groupchatdetails={groupchatdetails}/>  }
    </div>
  )
}

export default ChatBox