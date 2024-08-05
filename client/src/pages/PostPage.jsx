import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { formatISO9075 } from "date-fns"
import { UserContext } from "../contexts/UserContext"
import { CiEdit } from "react-icons/ci";

export default function PostPage() {

    const [postInfo, setPostInfo] = useState(null)
    const { id } = useParams()
    const { userInfo } = useContext(UserContext)

    useEffect(() => {

        fetch(`https://rq-blog-app.vercel.app/post/${id}`)
            .then(response => {
                response.json()
                    .then(postInfo => {
                        setPostInfo(postInfo)
                    })
            })
    }, [])

    if (!postInfo) {

        return ''
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-10  mx-auto mb-3 text-center lh-1">
                <h2 className="">{postInfo.title}</h2>
                <p className="fw-light mb-0">{formatISO9075(new Date(postInfo.createdAt))}</p>
                <p className="fw-bold">by {postInfo?.author?.username}</p>
                {userInfo?.id === postInfo.author._id && (
                    <div className="mb-3">
                        <Link to={`/edit/${id}`} className="btn btn-outline-secondary btn-sm">
                            <CiEdit />  Edit post
                        </Link>
                    </div>
                )}
                <img src={postInfo.cover}  className="img-fluid rounded shadow" alt="" />
            </div>
            <div className="col-12 col-md-10">
                <p>{postInfo.summary}</p>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
            </div>
        </div>
    )
}