import React from 'react'
import axios from 'axios'
import SideBar from 'components/miscellenous/SideBar'
import ChatBox from 'components/ChatBox'
import MyChats from 'components/MyChats'
import Header from 'components/miscellenous/Header'

const ChatPage = () => {


  return (
    <div>
        <Header/>
        <SideBar/>
        <div style={{display:'flex',justifyContent:'space-between'}}>
        <ChatBox/>
        <MyChats/>
        </div>
    </div>
  )
}

export default ChatPage