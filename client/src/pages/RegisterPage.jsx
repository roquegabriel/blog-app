import { useState } from "react"
import Alert from 'react-bootstrap/Alert'

export default function RegisterPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isFailure, setIsFailure] = useState(false)

    const register = async (e) => {
        e.preventDefault()
        const response = await fetch('https://rq-blog-app.vercel.app/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.status === 200) {
            setIsSuccess(true)
        }else{
            setIsFailure(true)
        } 
    }

    return (
        <div className='container'>
            <Alert variant="danger" show={isFailure} onClose={() => {
              setIsFailure(false)}} dismissible>
                Registration failed!
            </Alert>
            <Alert variant="success" show={isSuccess} onClose={() => {
              setIsSuccess(false)}} dismissible>
                Registration successfully!
            </Alert>
            <div className="row">
                <div className="col col-md-8 mx-auto">
                    <h2 className="text-center">Register</h2>
                    <form action="" className="" onSubmit={register}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}