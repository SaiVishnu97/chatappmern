import { Chat, User } from 'CommonTypes';
import React from 'react'
import { addNewProperties, useAppDispatch, useAppSelector } from 'state';

type ChatsListItemProps={
  chatdetails:Chat
  setSelectAllChats:React.Dispatch<React.SetStateAction<boolean>>
}
export const ChatsListItem:React.FC<ChatsListItemProps> = ({chatdetails,setSelectAllChats}) => {
    

  const currentuser:User&{token:string}=JSON.parse(localStorage.getItem('userinfo') as string);
  const otheruser=React.useMemo(()=>chatdetails.users.filter((val)=>val.email!==currentuser.email)[0],[chatdetails.users]);
  const dispatch=useAppDispatch();
  const frienduser=useAppSelector((state)=>state.chatapp.frienduser);
  const isSelected=frienduser?otheruser.email===frienduser.email:false;
  const selectChat=()=>{
    dispatch(addNewProperties({frienduser:otheruser}));
    dispatch(addNewProperties({groupchatdata:null}));
    dispatch(addNewProperties({currentchat: chatdetails}));
    setSelectAllChats(false);
  }
  const userincaps=otheruser.name.charAt(0).toUpperCase()+otheruser.name.slice(1);
  return (
    <div className={`chatlistitem ${isSelected?'chatselected':''}`} onClick={selectChat}>
      <div style={{paddingRight:'2%'}}>
      <img src={otheruser.pic} style={{borderRadius:'50%',overflow:'hidden',height:'60px'}}></img>
      </div>
      <div>
      <div style={{marginTop:'15%',fontWeight:'700',fontSize:'large'}}>{userincaps}</div>
      {chatdetails.latestMessage?((chatdetails.latestMessage.sender._id===currentuser._id?'You':userincaps)+' : '+chatdetails.latestMessage.content.slice(0,20)):''}
      </div>
    </div>
  )
}
type GroupChatsListItemProps={groupchatdetails:Chat}&Omit<ChatsListItemProps,'chatdetails'>
export const GroupChatsListItem:React.FC<GroupChatsListItemProps> = ({groupchatdetails,setSelectAllChats})=>{

  const selectedgroupchat=useAppSelector((state)=>state.chatapp.groupchatdata);
  const isSelected=selectedgroupchat?groupchatdetails._id===selectedgroupchat._id:false;
  const dispatch=useAppDispatch()
  const currentuser:User&{token:string}=JSON.parse(localStorage.getItem('userinfo') as string);
  const selectChat=()=>{
    dispatch(addNewProperties({groupchatdata:groupchatdetails}));
    dispatch(addNewProperties({frienduser:null}));
    dispatch(addNewProperties({currentchat: groupchatdetails}));
    setSelectAllChats(false)

  }
  let sender:string=''
  if(groupchatdetails.latestMessage)
    sender=groupchatdetails.latestMessage.sender.name.charAt(0).toUpperCase()+groupchatdetails.latestMessage.sender.name.slice(1)
  return( <div className={`chatlistitem ${isSelected?'chatselected':''}`} onClick={selectChat}> 
      <div >
      <img style={{borderRadius:'50%',overflow:'hidden',height:'35px'}}></img>
      </div>
      <div>
      <h3 style={{marginTop:'15%',fontWeight:'700',fontSize:'large'}}>{groupchatdetails.chatName.charAt(0).toUpperCase()+groupchatdetails.chatName.slice(1)}</h3>
      {groupchatdetails.latestMessage?((groupchatdetails.latestMessage.sender._id===currentuser._id?'You':sender)+' : '+groupchatdetails.latestMessage.content.slice(0,20)):''}
      </div>
    </div>);
}
