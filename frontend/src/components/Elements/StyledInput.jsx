import React from 'react'
import './Elements.css'
const StyledInput = (props) => {
  return (
    <div className='styledInput'> 
    <input {...props} ></input>
    </div>
  )
}

export default StyledInput