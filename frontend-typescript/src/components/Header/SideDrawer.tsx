import React from 'react'
import {
    Drawer,
    DrawerBody,
    
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useToast,
  } from '@chakra-ui/react'
import axios, { AxiosResponse } from 'axios'
import { addNewChats,addNewProperties, useAppDispatch } from 'state'
import { Spinner } from '@chakra-ui/react'
import {debounce} from 'lodash'

import 'components/miscellenous/miscellenous.css'
import StyledInput from 'components/Elements/StyledInput'
import UserListItem from 'components/miscellenous/UserListItem'
import { Chat, User } from 'CommonTypes'

type SideDrawerProps={
  isOpen: boolean
  onClose: ()=> void
}

const SideDrawer: React.FC<SideDrawerProps> = ({isOpen,onClose}) => {
  const [user,setUser]=React.useState("");
  const [allusers,setAllUsers]=React.useState([]);
  const [loading,setLoading]=React.useState(false);
  const dispatch=useAppDispatch();
  const toast = useToast();
  const currentuserdetails=React.useMemo(()=>JSON.parse(localStorage.getItem('userinfo') as string),[]);
  
  const selectChat=async(userdetails: User)=>{

    try
    {
      const config={
        headers:{
          authorization: "Bearer "+currentuserdetails.token
        }
      }
      onClose();
      const results: AxiosResponse<Chat>=await axios.post(`${process.env.REACT_APP_BACKENDURL?process.env.REACT_APP_BACKENDURL:''}/api/chats`,{userId:userdetails._id},config);
      if(results.status>=400)
        throw new Error("User didn't exist");
      dispatch(addNewChats(results.data));
      const frienduser=results.data.users.filter((val)=>val.email!==currentuserdetails.email)[0];

      dispatch(addNewProperties({frienduser}));
      dispatch(addNewProperties({currentchat: results.data}))
     
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
  const getUsers=debounce(async (signal: AbortSignal)=>{
    try
    {
        setLoading(true);
        const result = await axios.get(`${process.env.REACT_APP_BACKENDURL?process.env.REACT_APP_BACKENDURL:''}/api/users/login`,{
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
          signal,
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
      if(err.message!=='canceled')
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
  });
    React.useEffect(()=>{
      
        const controller=new AbortController();
        if(user)
          getUsers(controller.signal);
        else
          setAllUsers([]);
      
        return ()=>controller.abort();
    },[user]);
  return (
    <div>
        <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Chats</DrawerHeader>
          <div style={{display:'flex',justifyContent:'start'}}>
          <StyledInput type='text' style={{width:'150%' ,marginLeft:'10%'}} value={user} onChange={(e)=>setUser(e.target.value)} placeholder='Search by name or email' id='searchchats'/>
          {/* <Button onClick={getUsers} onMouseOver={(event: React.MouseEvent<HTMLElement>)=>{
const target = event.target as HTMLElement
target.style.background = '#a19d9d'}}
onMouseOut={(event)=>{
  const target = event.target as HTMLElement
  target.style.background='#E8E8E8'}} style={{width:'max-content',color:'black',padding:'4%',fontWeight:'700' ,backgroundColor:'#E8E8E8'}} >
            Go
          </Button> */}
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