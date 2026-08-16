import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import useConfirmDialog from './hooks/useConfirmDialog'
import blogService from './services/blogs'
import loginService from './services/login'
import { ToastContainer, toast } from 'react-toastify'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return user
    }
    return null
  })
  const [loginVisible, setLoginVisible] = useState(false)
  const togglableRef = useRef()
  const { confirmDialog, DialogComponent } = useConfirmDialog()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  const handleCreateBlog = async (blogObject) => {
    event.preventDefault()
    try {
      togglableRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogObject)
      setBlogs([...blogs, createdBlog].sort((a, b) => b.likes - a.likes))
      toast.success(`Added new blog: ${createdBlog.title} by ${user.username}`)
    } catch (error) {
      toast.error('Failed to add blog')
      console.error('Error creating blog:', error)
    }
  }

  const handleLogoff = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    toast.info('Logged out successfully')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      toast.success(`Logged in as ${user.username}`)
    } catch {
      toast.error('wrong credentials')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(
        blogs
          .map((b) => (b.id === blog.id ? returnedBlog : b))
          .sort((a, b) => b.likes - a.likes)
      )
      toast.success(`Liked ${blog.title}`)
    } catch (error) {
      toast.error(`Failed to like ${blog.title}`)
      console.error(`Failed to like ${blog.title}\n${error}`)
    }
  }

  const handleRemove = async (blog) => {
    const confirmed = await confirmDialog(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )
    if (confirmed) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        toast.success(`Removed "${blog.title}"`)
      } catch (error) {
        toast.error(`Failed to delete ${blog.title}`)
        console.error(`Failed to delete ${blog.title}\n${error}`)
      }
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const createForm = () => <CreateForm CreateBlog={handleCreateBlog} />

  const blogForm = () => (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  )

  return (
    <div>
      <h2>Le site</h2>
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.username} logged in
            <button onClick={handleLogoff}>Logoff</button>
          </p>
          <Togglable ref={togglableRef} buttonLabel="Create neb blog">
            <h2>Create new</h2>
            {createForm()}
          </Togglable>
        </div>
      )}
      <h2>Blogs</h2>
      {blogForm()}
      {DialogComponent}
      <ToastContainer position="top-right" autoClose={670} />
    </div>
  )
}

export default App
