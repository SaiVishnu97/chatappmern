import StyledInput from 'components/Elements/StyledInput'
import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner,
    CloseButton
  } from '@chakra-ui/react'
import Button from 'components/Elements/Button'
import './miscellenous.css'
import UserListItem from './UserListItem'
import axios from 'axios'
import useAutoComplete from './useAutoComplete'

const GroupChatModal = ({ isOpen, onClose }) => {

  const [chatname,setChatName]=React.useState('');
  const {
    userquery,
    setUserQuery,
    userslist,
    loading,
    setLoading,
    toast,
    setUsersList,
    selectedusers,
    setSelectedUsers,
    actualuserslist,
    setActualUsersList,
    currentuserdetails
  } = useAutoComplete();
  
  const createGroupChat=async()=>{
    try {
      setLoading(true)
      const reqbody={
        users: selectedusers,
        name: chatname
      }
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        },
      }
      if(chatname==='')
        throw new Error('Please provide the new group chat name');
      if(selectedusers.length<2)
        throw new Error('Atleast 3 members are required to create a group chat');
      const results=await axios.post(process.env.REACT_APP_BACKENDURL+"/api/chats/group",reqbody,config);
      if(results.status>=400)
        throw new Error(results.data);
      toast({
        title: `Group chat created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'

      });
      console.log(results.data);
      onClose();
    } catch (error) {
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
  const selectUsers=(userdetails)=>
  {
    setSelectedUsers((prevstate)=>[...prevstate,userdetails]);
  }
  const removeSelectedUsers=(userdetails)=>{
    setSelectedUsers((prevstate)=>{
      const newstate=prevstate.filter(val=>val.email!==userdetails.email);
      return newstate;
    })
  }
  React.useEffect(()=>{
    const newsetusers=actualuserslist.filter((val)=>!selectedusers.some(val1 => val1.email === val.email));
    setUsersList(newsetusers);
  },[selectedusers]);
  return (
    <div className='GroupChatModal'>
            <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader><div style={{fontSize:'1.8em' ,fontWeight:'700', textAlign:'center'}}>Create Group Chat</div></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <div style={{display:'flex',flexDirection:'column'}}>
            <StyledInput placeholder='Chat Name' style={{width:'100%'}} onChange={(e)=>setChatName(e.target.value)} value={chatname}/>
            <StyledInput placeholder='Enter Users' style={{width:'100%'}} onChange={(e)=>setUserQuery(e.target.value)} value={userquery}/>
              <div style={{display:'flex',flexWrap:'wrap'}}>
                {selectedusers.map((val,ind)=>{
                  return(<div style={{backgroundColor:'purple',color:'white',borderRadius:'20px',padding:'2%',marginRight:'2%', display:'flex'}} key={ind}>
                    {val.name}
                    <CloseButton style={{marginLeft:'2%'}}  size='sm' colorScheme='whiteAlpha' onClick={()=>removeSelectedUsers(val)}/>
                  </div>)
                })}
              </div>
            </div>
            <div style={{display:'flex',margin:'2%',flexDirection:'column', alignItems:'center'}}>
            {loading?<Spinner thickness='4px' size={'xl'}/>:userslist.map((val)=><UserListItem  userdetails={val}  onClick={()=>selectUsers(val)}/>)}
            </div>
        </ModalBody>

        <ModalFooter>
        <Button loading={loading} className="GroupChatModalButton" onClick={createGroupChat}>Create chat</Button>
        </ModalFooter>
        </ModalContent>
    </Modal>
    </div>

  )
}

export default GroupChatModal