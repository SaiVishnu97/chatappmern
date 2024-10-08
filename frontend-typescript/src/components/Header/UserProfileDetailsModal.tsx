import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { Button } from '@chakra-ui/react'
import { User } from 'CommonTypes'

type UserProfileDetailsModalProps=
{
    isOpen: boolean,
    onClose: ()=>void,
    frienduser?: User
}

const UserProfileDetailsModal = ({ isOpen, onClose,frienduser }:UserProfileDetailsModalProps ) => {
   

const userdetails=Boolean(frienduser)?frienduser:JSON.parse(localStorage.getItem('userinfo') as string);

return (
    <>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader><div style={{fontSize:'1.8em' ,fontWeight:'700', textAlign:'center'}}>{userdetails.name}</div></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div>
                <img src={userdetails.pic} height='200px' width='200px'/>
            </div>
            <div style={{fontSize:'1.5em' ,fontWeight:'700'}}>Email: {userdetails.email}
            </div>
            </div>
          
        </ModalBody>

        <ModalFooter>
            
            <Button colorScheme='blue' style={{width:'fit-content'}} onClick={onClose}>
            Close
            </Button>
        </ModalFooter>
        </ModalContent>
    </Modal>
    </>
)
}

export default UserProfileDetailsModal