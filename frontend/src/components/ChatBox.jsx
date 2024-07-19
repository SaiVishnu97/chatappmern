import React from 'react'
import "./components.css"
import ChatBoxHeader from './miscellenous/ChatBoxHeader'
import { useDispatch, useSelector } from 'react-redux'
import ChatArea from './ChatArea'



const ChatBox = () => {
  const frienduser=useSelector((state)=>state.chatapp.frienduser);
  const groupchatdetails=useSelector(state=>state.chatapp.groupchatdata);
  return (
    <div className='ChatBox'>
    {Boolean(frienduser||groupchatdetails)&&<ChatBoxHeader frienduser={frienduser} groupchatdetails={groupchatdetails}/>  }
    {Boolean(frienduser||groupchatdetails)?<ChatArea></ChatArea>:<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
    <div style={{fontSize:'1.5em',fontWeight:'500'}}>
    Click on a user to start chatting
    </div>
      </div>}
    </div>
  )
}

export default ChatBox