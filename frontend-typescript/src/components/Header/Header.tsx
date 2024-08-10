import Button from 'components/Elements/Button'
import { SearchIcon } from '@chakra-ui/icons'
import Profile from './Profile'
import { useDisclosure } from '@chakra-ui/react'
import SideDrawer from './SideDrawer'
import './HeaderStyles.css'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='Header'>
    <div>
    <Button style={{height:'30px', color:'black',padding:'20px'}} onMouseOver={(event)=>{
  const target =event.target as HTMLButtonElement
target.style.background = 'rgb(226,232,240)'}}
onMouseOut={(event)=>{const target =event.target as HTMLButtonElement
target.style.background=''}}
onClick={onOpen}
>
        <SearchIcon style={{marginRight:'10px'}}/>
        Search User</Button>
    <SideDrawer isOpen={isOpen} onClose={onClose}/>
    </div>
    <h2 style={{fontSize:'larger',fontWeight:'700'}}>Talk-A-Tive</h2>
<div className='profile'>
<div><i className="fa-solid fa-bell fa-xl" ></i>
</div>
<Profile/>
</div>
    </div>
  )
}

export default Header