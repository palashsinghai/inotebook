import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Signup = (props) => {
    const [creds, setCreds] = useState({name: "", email: "", password: "", cpassword: ""})
    let navigate = useNavigate()

    const onchange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/auth/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({name: creds.name, email: creds.email, password: creds.password}), 
          });
          const json = await response.json()
          console.log(json)
          if(json.success){
            localStorage.setItem('token', json.authToken)
            navigate("/login")
            props.showAlert("Successfully Signed Up", "success")
          }
          else{
            props.showAlert("Invalid Details", "danger")
          }
          
    }
    return (

        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onchange} value={creds.email} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input onChange={onchange} value={creds.name} type="text" className="form-control" id="name" name="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onchange} value={creds.password} type="password" className="form-control" name='password' id="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input onChange={onchange} value={creds.cpassword} type="password" className="form-control" name='cpassword' id="cpassword" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
