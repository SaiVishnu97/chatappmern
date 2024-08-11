import React from 'react'
// import ChatBox from 'components/ChatBox'
import MyChats from 'components/MyChats'
import Header from 'components/Header/Header'
import ChatBox from 'components/ChatBox';
import './Pages.css'
import { io, Socket } from 'socket.io-client';
import { Chat, ClientToServerEvents, Message, ServerToClientEvents } from 'CommonTypes';
import { addNewProperties, useAppDispatch } from 'state/index';
export let socket:Socket<ServerToClientEvents, ClientToServerEvents>=io(process.env.REACT_APP_BACKENDURL as string);


const ChatPage = () => {

const [selectallchats,setSelectAllChats]=React.useState<boolean>(true);
const currentuserdetails=React.useMemo(()=>JSON.parse(localStorage.getItem('userinfo') as string),[]);

React.useEffect(()=>{
  socket.on('ConnectionEstablishmentFromTheServer',()=>{
    console.log('connection establishment from the server')
    socket.emit('userSetup',currentuserdetails._id);

  })
},[]);
  return (
    <>
    <style>
      {`
      .chatsmain
      {
      display: flex;
      justify-content: space-evenly;
      margin-bottom: 2%;
      margin-top: 2%;
      height: 75vh;
      }
       @media only screen and (max-width: 768px) {
  /* For mobile phones: */
        .ChatBoxParent {
         display: ${selectallchats?'none':'block'};
        }
         .MyChatsParent {
         display: ${selectallchats?'block':'none'};
        }
      `}
    </style>
    <div>
        <Header/>
        <div className='chatsmain'>
          <div className='MyChatsParent'>
          <MyChats selectallchats={selectallchats} setSelectAllChats={setSelectAllChats}/>
          </div>
        <div className='ChatBoxParent'>
          <ChatBox selectallchats={selectallchats} setSelectAllChats={setSelectAllChats}/>
        </div>
        </div>
    </div>
    </>
  )
}

export default ChatPage