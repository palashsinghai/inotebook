import React from 'react'
import { useState} from 'react'
import { useNavigate} from 'react-router-dom'
export const Login = (props) => {
    const [creds, setCreds] = useState({email: "", password: ""})
    let navigate = useNavigate()

    const onchange = (e) => {
        setCreds({...creds, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email: creds.email, password: creds.password}), 
          });
          const json = await response.json()
          console.log(json)
          if(json.success){
            localStorage.setItem('token', json.authToken)
            navigate("/")
            props.showAlert("Successfully Logged In", "success")
          }
          else{
            props.showAlert("Invalid Credentials", "danger")
          }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input value={creds.email} onChange={onchange} type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input value={creds.password} onChange={onchange} type="password" className="form-control" id="password" name='password'/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
