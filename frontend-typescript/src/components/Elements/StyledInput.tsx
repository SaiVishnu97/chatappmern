import React, { InputHTMLAttributes } from 'react'
import './Elements.css'

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = React.forwardRef<HTMLInputElement,StyledInputProps>((props,ref) => {
  return (
    <div className='styledInput'> 
    <input {...props} ref={ref} ></input>
    </div>
  )
})

export default StyledInput