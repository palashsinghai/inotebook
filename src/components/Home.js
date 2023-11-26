import React from 'react'
import { Notes } from './Notes'

export const Home = (props) => {
  
  return (
    <div>
    <div className='container my-3'>
      <Notes showAlert={props.showAlert}/>
    </div>
    </div>
  )
}
