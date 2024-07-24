import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewProperties } from 'state';

export const ChatsListItem = ({chatdetails,setSelectAllChats}) => {
    

  const currentuser=JSON.parse(localStorage.getItem('userinfo'));
  const otheruser=React.useMemo(()=>chatdetails.users.filter((val)=>val.email!==currentuser.email)[0],[chatdetails.users]);
  const dispatch=useDispatch();
  const frienduser=useSelector((state)=>state.chatapp.frienduser);
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
      {chatdetails.latestMessage?chatdetails.latestMessage.sender._id===currentuser._id?'You':userincaps:''}:{chatdetails.latestMessage?.content.slice(0,20)}
      </div>
    </div>
  )
}

export const GroupChatsListItem = ({groupchatdetails,setSelectAllChats})=>{

  const selectedgroupchat=useSelector((state)=>state.chatapp.groupchatdata);
  const isSelected=selectedgroupchat?groupchatdetails._id===selectedgroupchat._id:false;
  const dispatch=useDispatch()
  const currentuser=JSON.parse(localStorage.getItem('userinfo'));
  const selectChat=()=>{
    dispatch(addNewProperties({groupchatdata:groupchatdetails}));
    dispatch(addNewProperties({frienduser:null}));
    dispatch(addNewProperties({currentchat: groupchatdetails}));
    setSelectAllChats(false)

  }
  const groupincaps=groupchatdetails.chatName.charAt(0).toUpperCase()+groupchatdetails.chatName.slice(1);
  const sender=groupchatdetails.latestMessage.sender.name.charAt(0).toUpperCase()+groupchatdetails.latestMessage.sender.name.slice(1)
  return( <div className={`chatlistitem ${isSelected?'chatselected':''}`} onClick={selectChat}> 
      <div >
      <img style={{borderRadius:'50%',overflow:'hidden',height:'35px'}}></img>
      </div>
      <div>
      <h3 style={{marginTop:'15%',fontWeight:'700',fontSize:'large'}}>{groupchatdetails.chatName.charAt(0).toUpperCase()+groupchatdetails.chatName.slice(1)}</h3>
      {groupchatdetails.latestMessage?groupchatdetails.latestMessage.sender._id===currentuser._id?'You':sender:''}:{groupchatdetails.latestMessage?.content.slice(0,20)}
      </div>
    </div>);
}
