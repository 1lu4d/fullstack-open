import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Paper,
  Typography,
  Stack,
  Button,
  Link as MuiLink,
  Divider
} from '@mui/material'

const Blog = ({ blogs, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <Typography>Where could it be...</Typography>
  }

  const creatorId = typeof blog.user === 'object' ? blog.user?.id : blog.user
  const isCreator = user && creatorId && user.id === creatorId
  const href = /^https?:\/\//.test(blog.url) ? blog.url : `https://${blog.url}`

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: 500 }} className="blog">
      <Typography variant="h5" component="h2">
        {blog.title}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        by {blog.author}
      </Typography>

      <Button
        size="small"
        variant="outlined"
        onClick={() => setVisible(!visible)}
        sx={{ mt: 1 }}
      >
        {visible ? 'hide' : 'view'}
      </Button>

      {visible && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Divider />
          <MuiLink href={href} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </MuiLink>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography>likes {blog.likes}</Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            added by{' '}
            {blog.user ? blog.user.name || blog.user.username : 'unknown'}
          </Typography>

          {isCreator && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handleRemove(blog)}
              sx={{ alignSelf: 'flex-start' }}
            >
              Remove
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  )
}

export default Blog
