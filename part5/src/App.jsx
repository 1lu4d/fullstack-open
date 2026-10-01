import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import { Container } from '@mui/material'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Navigation from './components/Navigation'
import useConfirmDialog from './hooks/useConfirmDialog'
import blogService from './services/blogs'
import loginService from './services/login'

import { Routes, Route, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'

const App = () => {
  const navigate = useNavigate()
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
  const { confirmDialog, DialogComponent } = useConfirmDialog()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs([...blogs, createdBlog].sort((a, b) => b.likes - a.likes))
      navigate('/')
      toast.success(`Added new blog: ${createdBlog.title} by ${user.username}`)
    } catch (error) {
      toast.error('Failed to add blog')
      console.error('Error creating blog:', error)
    }
  }

  const handleLogoff = (event) => {
    event?.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/login')
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
      navigate('/')
      toast.success(`Logged in as ${user.username}`)
    } catch {
      toast.error('wrong credentials')
    }
  }

  const handleLike = async (blog) => {
    if (!user) {
      toast.error('Log in to like blogs')
      return
    }
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
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
        navigate('/')
        toast.success(`Removed "${blog.title}"`)
      } catch (error) {
        toast.error(`Failed to delete ${blog.title}`)
        console.error(`Failed to delete ${blog.title}\n${error}`)
      }
    }
  }

  return (
    <Container>
      <Navigation user={user} handleLogoff={handleLogoff} />
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
        <Route
          path="/create"
          element={<CreateForm handleCreateBlog={handleCreateBlog} />}
        />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          }
        />
      </Routes>
      {DialogComponent}
      <ToastContainer position="top-right" autoClose={670} />
    </Container>
  )
}

export default App
