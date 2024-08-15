import React from 'react'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { User } from 'CommonTypes';
import { useAppSelector } from 'state';

const useAutoComplete = () => {
    const [userquery,setUserQuery]=React.useState('');
    const [userslist,setUsersList]=React.useState([] as User[]);
    const [actualuserslist,setActualUsersList]=React.useState([] as User[]);
    const toast=useToast();
    const [selectedusers,setSelectedUsers]=React.useState([] as User[]);
    const groupchatdetails=useAppSelector((state)=>state.chatapp.groupchatdata);
    const [loading,setLoading]=React.useState(false);
  const currentuserdetails: User&{token :string}=React.useMemo(()=>JSON.parse(localStorage.getItem('userinfo') as string),[])
  const deBouncedListUsers=debounce(async (signal)=>{
    try{
      setLoading(true);
        const result = await axios.get('/api/users/login',{
          headers:{
            authorization: "Bearer "+currentuserdetails.token
          },
          signal,
          params:{
            search: userquery
          }
        });
        if(result.status>=400)
        {
            throw new Error("Unable to look at the users")
        }
        if(Boolean(userquery))
        setActualUsersList(result.data as User[]);
        else
        setActualUsersList([]);
        result.data=(result.data as User[]).filter((val)=>!selectedusers.some(val1 => val1.email === val.email))

        if(Boolean(userquery))
        setUsersList(result.data);
        else
        setUsersList([]);
    }catch(err: any)
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
    finally{
      setLoading(false);
    }
  },500);
  React.useEffect(()=>{
    const controller = new AbortController();
    
    if(Boolean(userquery))
      deBouncedListUsers(controller.signal);
    else
    {
        setUsersList([]);
        setActualUsersList([]);
    }
    return ()=>controller.abort();
  },[userquery,groupchatdetails]);

  
  React.useEffect(()=>{

    return ()=>{
        setUsersList([]);
        setActualUsersList([]);
        setSelectedUsers([]);
    }
  },[]);
  return {
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
  }
}

export default useAutoComplete