import React from 'react'
import axios from 'axios'
import SideBar from 'components/Header/SideBar'
import ChatBox from 'components/ChatBox'
import MyChats from 'components/MyChats'
import Header from 'components/Header/Header'

const ChatPage = () => {


  return (
    <div>
        <Header/>
        <div style={{display:'flex',justifyContent:'space-evenly',marginBottom:'2%',height:'80vh',overflowY:'hidden'}}>
        <MyChats/>
        <ChatBox/>
        </div>
    </div>
  )
}

export default ChatPage