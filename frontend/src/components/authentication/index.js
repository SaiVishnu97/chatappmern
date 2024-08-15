import React, { useState } from 'react'
import './Authentication.css'
import Login from './Login';
import SignUp from './SignUp';

export const Authentication = () => {
    const [isLogin,setIsLogin]=useState(true);
  return (

    <div className='Authentication'>
        <div className='AppName'>
            <h2>Talk-A-Tive</h2>
        </div>
        <div className='loginsection'>
        <div className='selecttype'>
            <span onClick={()=>setIsLogin(true)} className={`${isLogin?'AuthTypeSelected':''}`}>Login</span>
            <span onClick={()=>setIsLogin(false)} className={`${!isLogin?'AuthTypeSelected':''}`}>SignUp</span>
        </div>
        {isLogin?<Login/>:<SignUp/>}
        </div>
    </div>
  )
}

