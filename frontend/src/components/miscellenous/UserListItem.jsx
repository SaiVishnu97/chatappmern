import React from 'react'
import './miscellenous.css'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addNewChats, addNewProperties } from 'state';
import { useToast } from '@chakra-ui/react';

const UserListItem = ({userdetails,...props}) => {
  
  return (
    <div className='userlistitem' {...props}>
      <div style={{paddingRight:'2%'}}>
      <img src={userdetails.pic} style={{borderRadius:'50%',overflow:'hidden'}} height='10px' width='50px'></img>
      </div>
      <div>
      <div>
        {userdetails.name}
        </div>
        <div>
            {userdetails.email}
        </div>
      </div>
      
    </div>
  )
}

export default UserListItem