import React from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useToast,
  } from '@chakra-ui/react'
import axios, { AxiosResponse } from 'axios'
import { addNewChats,addNewProperties } from 'state'
import { Spinner } from '@chakra-ui/react'

import 'components/miscellenous/miscellenous.css'
import StyledInput from 'components/Elements/StyledInput'
import Button from 'components/Elements/Button'
import UserListItem from 'components/miscellenous/UserListItem'
import { useDispatch } from 'react-redux'
import { Chat, CurrentUser, User } from 'CommonTypes'

type SideDrawerProps={
  isOpen: boolean
  onClose: ()=> void
}

const SideDrawer: React.FC<SideDrawerProps> = ({isOpen,onClose}) => {
  const [user,setUser]=React.useState("");
  const [allusers,setAllUsers]=React.useState([]);
  const toast=useToast();
  const [loading,setLoading]=React.useState(false);
  const dispatch=useDispatch();
  const currentuserdetails: CurrentUser=JSON.parse(localStorage.getItem('userinfo') as string);
  const selectChat=async(userdetails: User)=>{

    try
    {
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
      onClose();
      const results: AxiosResponse<Chat>=await axios.post(process.env.REACT_APP_BACKENDURL+'/api/chats',{userId:userdetails._id},config);
      if(results.status>=400)
        throw new Error("User didn't exist");
      dispatch(addNewChats(results.data));
      const frienduser=results.data.users.filter((val)=>val.email!==currentuserdetails.email)[0];

      dispatch(addNewProperties({frienduser}));
     
    }catch(err: any)
    {
      toast({
        title: 'Error while selecting the user',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }
  const getUsers=async ()=>{
    try
    {
        setLoading(true);
        const result = await axios.get(process.env.REACT_APP_BACKENDURL+'/api/users/login',{
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
          params:{
            search: user
          }
        });
        if(result.status>=400)
        {
            throw new Error("Unable to look at the users")
        }
        setAllUsers(result.data);
    }
    catch(err:any)
    {
        toast({
            title: 'Error while searching the users',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top'
          });
    }
    finally
    {
      setLoading(false);
    }
    
    
  }
  return (
    <div>
        <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Chats</DrawerHeader>
          <div style={{display:'flex',justifyContent:'space-evenly'}}>
          <StyledInput type='text' value={user} onChange={(e)=>setUser(e.target.value)} placeholder='Search by name or email' id='searchchats'/>
          <Button onClick={getUsers} onMouseOver={(event: React.MouseEvent<HTMLElement>)=>{
const target = event.target as HTMLElement
target.style.background = '#a19d9d'}}
onMouseOut={(event)=>{
  const target = event.target as HTMLElement
  target.style.background='#E8E8E8'}} style={{width:'max-content',color:'black',padding:'4%',fontWeight:'700' ,backgroundColor:'#E8E8E8'}} >
            Go
          </Button>
          </div>
          <DrawerBody>
            <div style={{display:'flex',margin:'2%',flexDirection:'column', alignItems:'center'}}>
            {loading?<Spinner thickness='4px' size={'xl'}/>:allusers.map((val)=><UserListItem  userdetails={val} onClick={()=>selectChat(val)} />)}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideDrawer