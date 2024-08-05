import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Post({ _id, title, summary, content, cover, createdAt, author }) {
    return (
        <div className='row mb-4 bg-light py-2 rounded' key={createdAt}>
            <div className='col-sm col-md-4'>
                <Link to={`/post/${_id}`}>
                    <img src={cover} alt="Post" className='rounded img-fluid' />
                </Link>
            </div>
            <div className='col-sm col-md-8'>
                <Link to={`/post/${_id}`}>
                    <h2 className='mb-0'>{title}</h2>
                </Link>
                <p className=''>
                    by <a href="http://example.com" className='autor fw-bold'>{author?.username}</a><time className='fw-light'> {formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className='text-truncate'>{summary}</p>
            </div>
        </div>
    )
}