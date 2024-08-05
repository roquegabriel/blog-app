import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import Alert from 'react-bootstrap/Alert'
import { UserContext } from "../contexts/UserContext"

export default function LoginPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isFailure, setIsFailure] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const { setUserInfo } = useContext(UserContext)

    const login = async (e) => {
        e.preventDefault()
        const response = await fetch('https://rq-blog-app.vercel.app/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                setRedirect(true)
            })
        } else {
            setIsFailure(true)
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className='container'>
            <Alert variant="danger" show={isFailure} onClose={() => { setIsFailure(false) }} dismissible >
                Login Failed!
            </Alert>
            <div className="row">
                <div className="col col-md-8 mx-auto">
                    <h2 className="text-center">Login</h2>
                    <form action="" className="" onSubmit={login}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" className="form-control" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="form-control mb-3" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <button className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}