import { useState } from 'react'
import { TextField, Button, Stack, Typography } from '@mui/material'

const CreateForm = ({ handleCreateBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreateBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Create nouveau blogh
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            required
            placeholder="title"
            size="small"
          />
          <TextField
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            required
            placeholder="author"
            size="small"
          />
          <TextField
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            required
            placeholder="url"
            size="small"
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default CreateForm
