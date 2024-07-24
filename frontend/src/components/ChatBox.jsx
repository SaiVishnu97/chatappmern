import React from 'react'
import "./components.css"
import ChatBoxHeader from './miscellenous/ChatBoxHeader'
import { useDispatch, useSelector } from 'react-redux'
import ChatArea from './ChatArea'
import ScrollableFeed from 'react-scrollable-feed'



const ChatBox = ({selectallchats,setSelectAllChats}) => {
  const frienduser=useSelector((state)=>state.chatapp.frienduser);
  const groupchatdetails=useSelector(state=>state.chatapp.groupchatdata);
  const currentchat=useSelector(state=>state.chatapp.currentchat)
  return (
    <>
    <style>
      {`
      @media only screen and (max-width: 768px) {
  /* For mobile phones: */
        .ChatBox {
         display: ${selectallchats?'none':'block'};
        }
    `}
    </style>
    

    <div className='ChatBox'>
    <>
    {Boolean(currentchat)&&<ChatBoxHeader setSelectAllChats={setSelectAllChats} selectallchats={selectallchats} frienduser={frienduser} groupchatdetails={groupchatdetails}/>  }
    {Boolean(currentchat)?<ChatArea ></ChatArea>:<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
    <div style={{fontSize:'1.5em',fontWeight:'500'}}>
    Click on a user to start chatting
    </div>
      </div>}
      </>

    </div>
    </>
  )
}

export default ChatBox