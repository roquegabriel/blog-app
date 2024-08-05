import { useContext, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
import Editor from '../components/Editor'
import { UserContext } from '../contexts/UserContext'

export default function CreatePostPage() {

    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { userInfo } = useContext(UserContext)

    const createPost = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('file', files[0])
        fetch('https://rq-blog-app.vercel.app/api/create', {
            method: 'POST',
            body: data,
            credentials: 'include'
        }).then(response => {
            if (response.ok) setRedirect(true)
        })
    }
    if (redirect || userInfo === null) {
        return <Navigate to={'/'} />
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-10">
                    <form onSubmit={createPost}>
                        <input type="text" className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                        <input type="text" className="form-control mb-2" placeholder="Summary" value={summary} onChange={(e) => { setSummary(e.target.value) }} />
                        <input className="form-control mb-3" type="file" id="formFile" onChange={(e) => { setFiles(e.target.files) }} multiple />
                        <Editor value={content} onChange={(newValue) => { setContent(newValue) }} />
                        <button className='btn btn-primary mt-2 w-50 d-block mx-auto'>Create post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}