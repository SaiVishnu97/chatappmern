import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    CloseButton,
    Spinner
  } from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from 'components/miscellenous/UserListItem'

import { Button } from '@chakra-ui/react'
import StyledInput from 'components/Elements/StyledInput'
import { updateChatData,addNewProperties, useAppDispatch, reShuffleMyChatsAfterDeletion, useAppSelector } from 'state'
import useAutoComplete from 'components/miscellenous/useAutoComplete'
import { Chat, CurrentUser, User } from 'CommonTypes'

type GroupChatProfileProps={
    isOpen: boolean;
    onClose: ()=>void;
    groupchatdetails: Chat;
}
const GroupChatProfile: React.FC<GroupChatProfileProps> = ({ isOpen, onClose,groupchatdetails }) => {
    const [chatname,setChatName]=React.useState<string>(groupchatdetails.chatName);
    const groupusers=groupchatdetails.users;
    const groupadmin=groupchatdetails.groupAdmin;
    let {socket}= useAppSelector((state)=>state.chatapp)

    const dispatch=useAppDispatch();
    const {
      userquery,
      setUserQuery,
      userslist,
      setUsersList,
      setSelectedUsers,
      selectedusers,
      toast,
      loading,
      setLoading,
      actualuserslist,
      setActualUsersList,
      currentuserdetails
    } =useAutoComplete();
    const isAdmin=groupadmin.email===currentuserdetails.email;

    const renameChat=async()=>{
        try {
            setLoading(true)
            const reqbody={
              chatid: groupchatdetails._id,
              chatname
            }
            const config={
              headers:{
                authorization: "Bearer "+currentuserdetails.token
              },
            }
            if(chatname==='')
              throw new Error('Please provide the new group chat name');
            const results=await axios.post("/api/chats/rename",reqbody,config);
            if(results.status>=400)
              throw new Error(results.data);
            toast({
              title: `Group chat renamed successfully`,
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top'
      
            });
            dispatch(updateChatData(results.data));
            dispatch(addNewProperties({groupchatdata:results.data}));
          } catch (error: any) {
            toast({
                  title: 'Failed to rename the group chat',
                  description: error.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top'
                });
          }
          finally{
            setLoading(false);
          }
        }
    const removeSelectedUsers=(userdetails: User)=>{
      setSelectedUsers((prevstate)=>{
        const newstate=prevstate.filter(val=>val.email!==userdetails.email);
        return newstate;
      })
    }
    const removeExistingUsers=async(userdetails: User)=>{
      try {
        setLoading(true)
        const reqbody={
          userid: userdetails._id,
          chatid: groupchatdetails._id
        }
        const config={
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
        }
        if(chatname==='')
          throw new Error('Please provide the group chat name');
        const results=await axios.post("/api/chats/remove",reqbody,config);
        if(results.status>=400)
          throw new Error(results.data);
        toast({
          title: `User removed successfully from the group`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
  
        });
        dispatch(updateChatData(results.data));
        dispatch(addNewProperties({groupchatdata:results.data}));
      } catch (error: any) {
        toast({
              title: 'Failed to remove the user from the group chat',
              description: error.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
      }
      finally{
        setLoading(false);
      }
    }
    const addUsersToTheGroup=async()=>{
      try {
        setLoading(true)
        const reqbody={
          userid: selectedusers[0]._id,
          chatid: groupchatdetails._id
        }
        const config={
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
        }
        if(chatname==='')
          throw new Error('Please provide the group chat name');
        const results=await axios.post("/api/chats/add",reqbody,config);
        if(results.status>=400)
          throw new Error(results.data);
        toast({
          title: `User Added successfully to the group`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
  
        });
        dispatch(updateChatData(results.data));
        dispatch(addNewProperties({groupchatdata:results.data}));
        setSelectedUsers([]);
      } catch (error: any) {
        toast({
              title: 'Failed to create the group chat',
              description: error.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
      }
      finally{
        setLoading(false);
      }
    }
    const deleteCurrentChat=async (currentuserdetails: CurrentUser)=>
    {
      try {
        setLoading(true)
        const reqbody={
          userid: currentuserdetails._id,
          chatid: groupchatdetails._id
        }
        const config={
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
        }
        if(chatname==='')
          throw new Error('Please provide the group chat name');
        const results=await axios.delete("/api/chats/deletechat",{data:reqbody,...config});
        if(results.status>=400)
          throw new Error(results.data);
        toast({
          title: `Admin deleted the group chat successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
  
        });
        dispatch(addNewProperties({groupchatdata:null}));
        dispatch(addNewProperties({currentchat: null}));
        dispatch(reShuffleMyChatsAfterDeletion(groupchatdetails));
        socket?.emit('groupChatDeleted',JSON.stringify({currentchat:groupchatdetails,currentuser:currentuserdetails}));
      } catch (error: any) {
        toast({
              title: 'Failed to delete the group chat',
              description: error.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
      }
      finally{
        setLoading(false);
      }
    }
    const selectUsers=(userdetails: User)=>
    {
      setSelectedUsers([userdetails]);
    }
    React.useEffect(()=>{
      let newuserlist=actualuserslist.filter((val)=>!groupusers.some(val1=>val1.email===val.email));
      if(selectedusers.length)
      newuserlist=newuserlist.filter((val)=>val.email!==selectedusers[0].email);
      setUsersList(newuserlist);
    },[userslist.length,groupusers.length,selectedusers])
    const modalClose=()=>{

      setUsersList([]);
      setActualUsersList([]);
      setSelectedUsers([]);
      setUserQuery('');
      onClose();

    }
  return (
    <>
        <Modal isOpen={isOpen} onClose={modalClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader><div style={{fontSize:'1.8em' ,fontWeight:'700', textAlign:'center'}}>{groupchatdetails.chatName}</div></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <div style={{display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',flexWrap:'wrap'}}>
                {groupusers.map((val,ind)=>{
                  return(<div style={{backgroundColor:'purple',color:'white',borderRadius:'20px',padding:'2%',margin:'2%', display:'flex'}} key={ind}>
                    {val.name}
                    {isAdmin&&val._id!==currentuserdetails._id&&<CloseButton style={{marginLeft:'2%'}}  size='sm' colorScheme='whiteAlpha' onClick={()=>removeExistingUsers(val)} />}
                  </div>)
                })}
              </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            <StyledInput placeholder='Chat Name' onChange={(e)=>setChatName(e.target.value)} value={chatname}/>
            {loading?<Spinner/>:<Button colorScheme='purple' variant='solid' style={{marginLeft:'10px',flexGrow:'1'}} onClick={renameChat}>
                Rename chat
            </Button>}
            </div>
            <StyledInput placeholder='Add new Users' style={{width:'100%'}} onChange={(e)=>setUserQuery(e.target.value)} value={userquery}/>
            <div style={{display:'flex',flexWrap:'wrap'}}>
                {selectedusers.map((val,ind)=>{
                  return(<div style={{backgroundColor:'purple',color:'white',borderRadius:'20px',padding:'2%',marginRight:'2%', display:'flex'}} key={ind}>
                    {val.name}
                   <CloseButton style={{marginLeft:'2%'}}  size='sm' colorScheme='whiteAlpha' onClick={()=>removeSelectedUsers(val)}/>
                  </div>)
                })}
              </div>
              <div style={{display:'flex',margin:'2%',flexDirection:'column', alignItems:'center'}}>
            {loading?<Spinner thickness='4px' size={'xl'}/>:(userslist.length>0||userquery==='')?userslist.map((val)=><UserListItem  userdetails={val}  onClick={()=>selectUsers(val)}/>)
          :<div style={{fontSize:'1.8em' ,fontWeight:'700', textAlign:'center'}}>
          No users found
          </div>  
          }
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
            
            {loading?<Spinner/>:<Button colorScheme='blue' style={{width:'fit-content'}} onClick={addUsersToTheGroup}>
            Add users
            </Button>}
            {!loading&&isAdmin?<Button colorScheme='red' style={{width:'fit-content'}} onClick={()=>deleteCurrentChat(currentuserdetails)}>Delete the group</Button>
            :<Button colorScheme='red' style={{width:'fit-content'}} onClick={()=>removeExistingUsers(currentuserdetails)}>Exit from the group</Button>}
        </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatProfile