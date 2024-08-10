import "./components.css"
import ChatBoxHeader from './miscellenous/ChatBoxHeader'
import ChatArea from './ChatArea'
import { useAppSelector } from 'state/index'
import { Chat, User } from "CommonTypes"

type ChatBox={
  selectallchats: boolean,
  setSelectAllChats:React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox:React.FC<ChatBox> = ({selectallchats,setSelectAllChats}) => {
  const frienduser=useAppSelector((state)=>state.chatapp.frienduser);
  const groupchatdetails=useAppSelector(state=>state.chatapp.groupchatdata);
  const currentchat=useAppSelector(state=>state.chatapp.currentchat)
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
    
    {Boolean(currentchat)&&<ChatBoxHeader setSelectAllChats={setSelectAllChats} selectallchats={selectallchats} frienduser={frienduser as User} groupchatdetails={groupchatdetails as Chat}/>  }
    {Boolean(currentchat)?
    <div className="ChatAreaParent">
      <ChatArea ></ChatArea>
    </div>:<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
    <div style={{fontSize:'1.5em',fontWeight:'500'}}>
    Click on a user to start chatting
    </div>
      </div>}
    </div>
    </>
  )
}

export default ChatBox