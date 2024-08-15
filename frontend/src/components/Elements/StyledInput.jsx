import React from 'react'
import './Elements.css'
const StyledInput = React.forwardRef((props,ref) => {
  return (
    <div className='styledInput'> 
    <input {...props} ref={ref} ></input>
    </div>
  )
})

export default StyledInput