import { useState } from 'react'
import { useParams } from 'react-router-dom'

const Blog = ({ blogs, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!blog) {
    return <div>Where could it be...</div>
  }

  const creatorId = typeof blog.user === 'object' ? blog.user?.id : blog.user
  const isCreator = user && creatorId && user.id === creatorId

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            {user && <button onClick={() => handleLike(blog)}>like</button>}
          </div>
          <div>{blog.user ? blog.user.name || blog.user.username : ''}</div>
          {isCreator && (
            <button onClick={() => handleRemove(blog)}>Remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
