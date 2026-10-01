import { useState } from 'react'

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
    <form onSubmit={handleSubmit}>
      <h2>Create nouveau blogh</h2>
      <div>
        <label>
          title:{' '}
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            required
            type="text"
            placeholder="type title"
          />
        </label>
      </div>
      <div>
        <label>
          author:{' '}
          <input
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            required
            type="text"
            placeholder="type author"
          />
        </label>
      </div>
      <div>
        <label>
          url:{' '}
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            required
            type="text"
            placeholder="type url"
          />
        </label>
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  )
}

export default CreateForm
