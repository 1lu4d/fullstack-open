import { useState } from 'react'

const CreateForm = ({ CreateBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    CreateBlog({
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
