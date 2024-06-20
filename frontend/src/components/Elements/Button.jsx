import React from 'react'
import { Spinner } from '@chakra-ui/react'
const Button = ({children,loading,...props}) => {
  return (
    <>
    <button {...props}  disabled={loading}>
    {loading?<Spinner/>:children}</button>
    </>
  )
}

export default Button