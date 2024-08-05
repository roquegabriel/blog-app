import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown"
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FaUserCircle } from "react-icons/fa";

export default function Header() {

  const { setUserInfo, userInfo } = useContext(UserContext)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    fetch('https://rq-blog-app.vercel.app/api/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    })
  }, [])

  const logout = () => {
    fetch('https://rq-blog-app.vercel.app/api/logout', {
      credentials: 'include',
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        setUserInfo(null)
      }
    })
  }

  const username = userInfo?.username


  return (
    <header className='fixed-top d-flex justify-content-between align-items-center px-2 pt-2'>
      <h1><Link to={'/'} className="">MyBlog</Link></h1>
      <nav className='d-flex gap-3'>
        {username ? (
          <Dropdown as={ButtonGroup}>
            <div className="d-flex justify-content-center align-items-center p-1">
              <FaUserCircle size={25} />
            </div>
            <Dropdown.Toggle split variant="" className="border-0" />
            <Dropdown.Menu>
              <Dropdown.Item>{username}</Dropdown.Item>
              <Dropdown.Item href={'/create'}>Create new post</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <>
            <Link to={"/login"} className=''>Login</Link>
            <Link to={"/register"} className=''>Register</Link>
          </>
        )}
      </nav>
    </header >
  )
}