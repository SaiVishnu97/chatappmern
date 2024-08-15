import Button from 'components/Elements/Button'
import React from 'react'
import UserProfileDetailsModal from 'components/Header/UserProfileDetailsModal';
import { useDisclosure } from '@chakra-ui/react';
import GroupChatProfile from 'components/Header/GroupChatProfile';

const ChatBoxHeader = ({frienduser,groupchatdetails,setSelectAllChats,selectallchats}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
 
    let chatboxtitle;
    if(frienduser)
       chatboxtitle=frienduser?frienduser.name.charAt(0).toUpperCase()+frienduser.name.slice(1):''
    if(!Boolean(chatboxtitle)&&groupchatdetails)
      chatboxtitle=groupchatdetails?groupchatdetails.chatName.charAt(0).toUpperCase()+groupchatdetails.chatName.slice(1):''
  return (
    <div className='ChatBoxHeader'>
      <i className="fa-solid fa-arrow-left fa-2xl" onClick={()=>setSelectAllChats(true)}></i>
        <span style={{fontSize:'1.5em',fontWeight:'500'}} >{chatboxtitle}</span>
        <Button onClick={onOpen} onMouseOver={(event)=>
event.target.style.background = '#a19d9d'}
onMouseOut={(event)=>event.target.style.background='#E8E8E8'} style={{width:'max-content',color:'black',padding:'1%',fontWeight:'400' ,backgroundColor:'#E8E8E8'}}><i className="fa-solid fa-eye"></i>
        </Button>
        {frienduser&&isOpen&&<UserProfileDetailsModal isOpen={isOpen} onClose={onClose} frienduser={frienduser}/>}
        {groupchatdetails&&isOpen&&<GroupChatProfile isOpen={isOpen} onClose={onClose} groupchatdetails={groupchatdetails}/>}

    </div>
  )
}

export default ChatBoxHeader