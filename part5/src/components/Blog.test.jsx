import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CreateForm from './CreateForm'
import Blog from './Blog'

describe('Blog component', () => {
  const creator = {
    username: 'root',
    id: '6a7ed75b2a222b171fce4233'
  }
  const otherUser = {
    username: 'other',
    id: 'other-id-000'
  }

  const blog = {
    url: 'https://cs50.ly/surprise',
    title: 'Super test',
    author: '1lu4d',
    likes: 359015,
    id: '6a7ed8efe04d4d8c5baac857',
    user: creator
  }

  const renderBlog = (user, handleLike = () => {}, handleRemove = () => {}) =>
    render(
      <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={[blog]}
                user={user}
                handleLike={handleLike}
                handleRemove={handleRemove}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

  test('renders title and author but not url and likes initially', () => {
    const { container } = renderBlog(null)

    expect(container).toHaveTextContent('Super test')
    expect(container).toHaveTextContent('1lu4d')
    expect(container).not.toHaveTextContent('https://cs50.ly/surprise')
    expect(container).not.toHaveTextContent('359015')
  })

  test('renders url and likes when view button clicked', async () => {
    const user = userEvent.setup()
    const { container } = renderBlog(null)

    await user.click(screen.getByText('view'))

    expect(container).toHaveTextContent('https://cs50.ly/surprise')
    expect(container).toHaveTextContent('359015')
  })

  // ---- Задание 5.27 ----

  test('unauthenticated user sees info and likes, but no buttons', async () => {
    const user = userEvent.setup()
    renderBlog(null)

    await user.click(screen.getByText('view'))

    expect(screen.getByText(/Super test/)).toBeDefined()
    expect(screen.getByText(/likes 359015/)).toBeDefined()
    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
  })

  test('authenticated non-creator sees only the like button', async () => {
    const user = userEvent.setup()
    renderBlog(otherUser)

    await user.click(screen.getByText('view'))

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
  })

  test('creator sees both like and Remove buttons', async () => {
    const user = userEvent.setup()
    renderBlog(creator)

    await user.click(screen.getByText('view'))

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDefined()
  })

  // ---- старое поведение, но через MemoryRouter ----

  test('calls handleLike twice when like button clicked twice', async () => {
    const mockHandleLike = vi.fn()
    const user = userEvent.setup()

    renderBlog(creator, mockHandleLike)

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandleLike).toHaveBeenCalledTimes(2)
  })
})

describe('CreateForm component', () => {
  test('calls CreateBlog with right details when submitted', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateForm handleCreateBlog={mockCreateBlog} />)

    await user.type(
      screen.getByPlaceholderText('type title'),
      'Test Blog Title'
    )
    await user.type(screen.getByPlaceholderText('type author'), 'Test Author')
    await user.type(screen.getByPlaceholderText('type url'), 'https://test.com')

    await user.click(screen.getByText('Create'))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://test.com'
    })
  })
})
