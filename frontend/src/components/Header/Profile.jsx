import React from 'react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import UserProfileDetailsModal from './UserProfileDetailsModal'
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userdetails=JSON.parse(localStorage.getItem('userinfo'));
  const navigate=useNavigate();
  return (
    // <div style={{padding:'5px',marginLeft:'5%', flexGrow:'1'}} onMouseOver={(event)=>
    //     event.target.style.background = 'rgb(226,232,240)'}
    //     onMouseOut={(event)=>event.target.style.background=''}>
    //     <i class="fa-solid fa-circle-user" style={{color:'rgb(224,224,224)',fontSize:'25px'}}></i>
    // </div>
    <Menu>
  <MenuButton
    transition='all 0.2s'
    borderRadius='md'
    as={Button} rightIcon={<ChevronDownIcon />}
    colorScheme="white"
    color='black'
    style={{display:'flex',alignItems:'center',width:'100%'}}
    _hover={{ bg: 'gray.400' }}
    _expanded={{ bg: 'blue.400' }}
    _focus={{ boxShadow: 'outline' }}
  >
    {userdetails.pic?<img style={{borderRadius:'50%',overflow:'hidden',height:'35px'}} src={userdetails.pic}/>:<i class="fa-solid fa-circle-user" style={{color:'rgb(224,224,224)',fontSize:'25px',marginRight:'10px'}}></i>}
  </MenuButton>
  <MenuList>
    <MenuItem onClick={onOpen}>My Profile</MenuItem>
    <UserProfileDetailsModal isOpen={isOpen} onClose={onClose} />
    <MenuDivider />
    <MenuItem onClick={()=>{localStorage.removeItem('userinfo');navigate('/');}}>Log out</MenuItem>
    
  </MenuList>
</Menu>
  )
}

export default Profile