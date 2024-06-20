import Button from 'components/Elements/Button'
import React from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import Profile from './Profile'

const Header = () => {
  return (
    <div style={{width:'100%',backgroundColor:'white',
    display:'flex',justifyContent:'space-between',
    padding:'1%',border:'5px solid rgb(226,232,240)'}}>
    <div>
    <Button style={{height:'30px', color:'black',padding:'20px'}} onMouseOver={(event)=>
event.target.style.background = 'rgb(226,232,240)'}
onMouseOut={(event)=>event.target.style.background=''}
>
        <SearchIcon style={{marginRight:'10px'}}/>
        Search User</Button>

    </div>
    <h2 style={{fontSize:'larger',fontWeight:'700'}}>Talk-A-Tive</h2>
<div style={{width:'10%',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
<div><i className="fa-solid fa-bell fa-xl" ></i>
</div>
<Profile/>
</div>
    </div>
  )
}

export default Header