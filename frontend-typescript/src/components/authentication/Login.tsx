import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import './Loginform.css'
import StyledInput from 'Elements/StyledInput'
import Button from 'Elements/Button'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { addNewProperties, useAppDispatch } from 'state';
import { LoginInitialValues } from './AuthenticationTypesDeclarations'

console.log(process.env.REACT_APP_BACKENDURL)
interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
}
type ValidateFunc=(values:Partial<LoginInitialValues>)=>Partial<LoginInitialValues>;
type OnSubmitType=(values:LoginInitialValues)=>void
const initialValues :LoginInitialValues={
  email:'',
  password:''
}
const Login:React.FC = () => {
  const [loading,setLoading]=React.useState<boolean>(false);
  const navigate=useNavigate();
  const dispatch=useAppDispatch();
  const toast=useToast();
const validate:ValidateFunc=(values)=>{
  const errors:Partial<LoginInitialValues>={}
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if(!values.password)
    errors.password='Password is required'
  return errors;
}
const onSubmit:OnSubmitType= async(values) => {
  try{
    
    setLoading(true);
    const response=await fetch(`${process.env.REACT_APP_BACKENDURL?process.env.REACT_APP_BACKENDURL:''}/api/users/login`,{headers:{
      'Content-Type':'application/json', 
    },
    method: 'POST',
    body: JSON.stringify(values)
  });
    if(response.status>=400)
      throw new Error('Invalid credentials');
    const result=await response.json();
    localStorage.setItem('userinfo',JSON.stringify(result));
    dispatch(addNewProperties({'userinfo':result}))
    setLoading(false);
    navigate('/chats');
    }
    catch(err:any)
    {
      toast({
        title: 'Failed to login into the account',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      setLoading(false);
    }

}
const formik=useFormik({
  initialValues,
  validate,
  onSubmit
});
const guestDetails=async ()=>{
  try{
        setLoading(true)
        const response=await fetch(`${process.env.REACT_APP_BACKENDURL?process.env.REACT_APP_BACKENDURL:''}/api/users/login`,{headers:{
      'Content-Type':'application/json', 
    },
    method: 'POST',
    body: JSON.stringify({email:'guest@gmail.com',password:'12345678'})
  });
  const result=await response.json();
  setGuest(result);
  setLoading(false);
     }
     catch(err:any)
      {
        toast({
          title: 'Unable to fetch the guest details',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'})
        }
}
const passwordinputref=React.useRef<HTMLInputElement>(null);
const [guest,setGuest]=React.useState<Partial<User>>({});
const togglePassword=(event: React.MouseEvent<HTMLElement>)=>{
    if(passwordinputref.current&&event.target){
    const type = passwordinputref.current.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordinputref.current.setAttribute('type', type);
    
    // Toggle the icon
    const target = event.target as HTMLElement
    target.classList.toggle('fa-eye');
    target.classList.toggle('fa-eye-slash');
    }
}
useEffect(()=>{
  guestDetails();
},[])
  return (
    <div className='loginform'>
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor='email'>Email Address: </label>
        <StyledInput type='text' onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} placeholder='Enter EmailId' id='email' name='email'/>
        {formik.touched.email && formik.errors.email ? (
         <div style={{color:'red'}}>{formik.errors.email}</div>
       ) : null}
       <div className="password-container">
        <label htmlFor='password'>Password: </label>
        <StyledInput ref={passwordinputref} type='password' onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur} style={{width:'50%'}} placeholder='Enter Password' id='password'/>
        {formik.touched.password && formik.errors.password ? (
         <div style={{color:'red'}}>{formik.errors.password}</div>
       ) : null}
        <i onClick={togglePassword} className="fa-solid fa-eye"></i>
        </div>
        <Button loading={loading} style={{backgroundColor:'rgb(49,130,206)',marginTop:'2%'}} type='submit'>login</Button>
        <Button loading={loading} style={{backgroundColor:'rgb(203,51,51)',marginTop:'2%'}} type='button' onClick={()=>formik.setValues({email:guest.email?guest.email:'',password:'12345678'})}>Get Guest User Credentials</Button>
        </form>
    </div>
  )
}

export default Login