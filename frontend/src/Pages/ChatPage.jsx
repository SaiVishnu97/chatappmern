import React from 'react'
import ChatBox from 'components/ChatBox'
import MyChats from 'components/MyChats'
import Header from 'components/Header/Header'

const ChatPage = () => {

const [selectallchats,setSelectAllChats]=React.useState(true);
  return (
    <>
    <style>
      {`
      .chatsmain
      {
      display: flex;
      justify-content: space-evenly;
      margin-bottom: 2%;
      height: 80vh;
      overflow-y: hidden;
      }
      `}
    </style>
    <div>
        <Header/>
        <div className='chatsmain'>
          <MyChats selectallchats={selectallchats} setSelectAllChats={setSelectAllChats}/>
          <ChatBox selectallchats={selectallchats} setSelectAllChats={setSelectAllChats}/>
        </div>
    </div>
    </>
  )
}

export default ChatPage