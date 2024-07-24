import React, { useRef, useState } from 'react'
import './Loginform.css'
import StyledInput from 'components/Elements/StyledInput'
import Button from 'components/Elements/Button'
import { useFormik } from 'formik';
import { validationSchema } from './validationschema';
import { useToast } from '@chakra-ui/react' 
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewProperties } from 'state';
const initialValues={}

const SignUp = () => {
    const [loading,setLoading]=useState(false);
    const [img,setImg]=useState();
    const dispatch=useDispatch();
    const toast = useToast()
    const navigate=useNavigate();
    const onSubmit= async(values, { resetForm }) => {
      try{
      setLoading(true);
      const formdata=new FormData();
      if(img===undefined)
      {
        toast({
          title: 'Image not selected',
          description: "It is mandatory to upload an image as DP",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      formdata.append('file',img);
      formdata.append('upload_preset','chat-app');
      formdata.append('cloud_name','doopc2ufu');
      const responseimage=await fetch('https://api.cloudinary.com/v1_1/doopc2ufu/image/upload',{
        method :'POST',
        body: formdata
      });
      if(responseimage.status!==200)
        throw new Error('Unable to upload the image')
      const imageurldata=await responseimage.json();
      values.pic=imageurldata.secure_url
      const response=await fetch('http://localhost:5000/api/users',{headers:{
        'Content-Type':'application/json', 
      },
      method: 'POST',
      body: JSON.stringify(values)
    });
    if (!response.ok) {
      const errorMessage = await response.text(); // Extract the error message from the response
      throw new Error(errorMessage); // Throw an error to be caught in the catch block
  }
    const result=await response.json();
   
    localStorage.setItem('userinfo',JSON.stringify(result));
    dispatch(addNewProperties({'userinfo':result}));
    setLoading(false);
    navigate('/chats');
    }
    catch(err)
    {
      toast({
        title: 'Failed to create the account',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      setLoading(false);
    }

    }
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })
    const imgref=useRef();
    
    const imageUpload=(event)=>
    {
        imgref.current.src=URL.createObjectURL(event.target.files[0]);
        imgref.current.style.height='100px';
        imgref.current.style.width='100px';
        setImg(event.target.files[0]);
    }
  return (
    <div className='signupform'>
        <form onSubmit={formik.handleSubmit} encType='x-www-form-urlencoded'>
        <img ref={imgref} style={{borderRadius:'50%' }}></img>
        <label htmlFor='name'>Name: </label>
        <StyledInput type='text' onChange={formik.handleChange} onBlur={formik.handleBlur} name='name' placeholder='Enter Name' id='name'/>
        {formik.touched.name && formik.errors.name ? (
         <div style={{color:'red'}}>{formik.errors.name}</div>
       ) : null}
        <label htmlFor='email'>Email Address: </label>
        <StyledInput onBlur={formik.handleBlur} name='email' onChange={formik.handleChange} type='text' placeholder='Enter EmailId' id='email'/>
        {formik.touched.email && formik.errors.email ? (
         <div style={{color:'red'}}>{formik.errors.email}</div>
       ) : null}
        <label  htmlFor='password'>Password: </label>
        <StyledInput onBlur={formik.handleBlur} onChange={formik.handleChange} name='password' type='password' style={{width:'50%'}} placeholder='Enter Password' id='password'/>
        {formik.touched.password && formik.errors.password ? (
         <div style={{color:'red'}}>{formik.errors.password}</div>
       ) : null}
        <label htmlFor='confirmpassword'>Confirm Password: </label>
        <StyledInput onBlur={formik.handleBlur} onChange={formik.handleChange} name='confirmpassword' type='password' style={{width:'50%'}} placeholder='Confirm Password' id='confirmpassword'/>
        {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
         <div style={{color:'red'}}>{formik.errors.confirmpassword}</div>
       ) : null}
        <label htmlFor='uploadpic'>Upload your profile pic:</label>
        <StyledInput onChange={imageUpload} type='file' id='uploadpic' name='file' accept="image/*"/>
        <Button loading={loading} style={{backgroundColor:'rgb(49,130,206)'}} type="submit">SignUp</Button>
        </form>
    </div>
  )
}

export default SignUp