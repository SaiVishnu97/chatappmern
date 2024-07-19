import React from 'react'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';

const useAutoComplete = () => {
    const [userquery,setUserQuery]=React.useState('');
    const [userslist,setUsersList]=React.useState([]);
    const [actualuserslist,setActualUsersList]=React.useState([]);
    const toast=useToast();
    const [selectedusers,setSelectedUsers]=React.useState([]);
    const groupchatdetails=useSelector((state)=>state.chatapp.groupchatdata);
    const [loading,setLoading]=React.useState(false);
  const currentuserdetails=React.useMemo(()=>JSON.parse(localStorage.getItem('userinfo')),[])
  const deBouncedListUsers=debounce(async (signal)=>{
    try{
      setLoading(true);
        const result = await axios.get(process.env.REACT_APP_BACKENDURL+'/api/users/login',{
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
        console.log(userquery);
        if(Boolean(userquery))
        setActualUsersList(result.data);
        else
        setActualUsersList([]);
        result.data=result.data.filter((val)=>!selectedusers.some(val1 => val1.email === val.email))

        if(Boolean(userquery))
        setUsersList(result.data);
        else
        setUsersList([]);
    }catch(err)
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