import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewProperties } from 'state';

export const ChatsListItem = ({chatdetails}) => {
    

  const currentuser=JSON.parse(localStorage.getItem('userinfo'));
  const otheruser=React.useMemo(()=>chatdetails.users.filter((val)=>val.email!==currentuser.email)[0],[chatdetails.users]);
  const dispatch=useDispatch();
  const frienduser=useSelector((state)=>state.chatapp.frienduser);
  const isSelected=frienduser?otheruser.email===frienduser.email:false;
  const selectChat=()=>{
    dispatch(addNewProperties({frienduser:otheruser}));
    dispatch(addNewProperties({groupchatdata:null}));

  }
  return (
    <div className={`chatlistitem ${isSelected?'chatselected':''}`} onClick={selectChat}>
      <div style={{paddingRight:'2%'}}>
      <img src={otheruser.pic} style={{borderRadius:'50%',overflow:'hidden',height:'100%'}}></img>
      </div>
      <div>
      <div style={{marginTop:'15%',fontWeight:'700',fontSize:'large'}}>{otheruser.name.charAt(0).toUpperCase()+otheruser.name.slice(1)}</div>
      {chatdetails.latestMessage?.content}
      </div>
    </div>
  )
}

export const GroupChatsListItem = ({groupchatdetails})=>{

  const selectedgroupchat=useSelector((state)=>state.chatapp.groupchatdata);
  const isSelected=selectedgroupchat?groupchatdetails._id===selectedgroupchat._id:false;
  const dispatch=useDispatch()
  const selectChat=()=>{
    dispatch(addNewProperties({groupchatdata:groupchatdetails}));
    dispatch(addNewProperties({frienduser:null}));
  }
  return( <div className={`chatlistitem ${isSelected?'chatselected':''}`} onClick={selectChat}> 
      <div >
      <img style={{borderRadius:'50%',overflow:'hidden',height:'35px'}}></img>
      </div>
      <div>
      <h3 style={{marginTop:'15%',fontWeight:'700',fontSize:'large'}}>{groupchatdetails.chatName.charAt(0).toUpperCase()+groupchatdetails.chatName.slice(1)}</h3>
      {groupchatdetails.latestMessage?.content}
      </div>
    </div>);
}
