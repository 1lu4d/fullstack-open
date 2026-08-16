import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    url: 'https://cs50.ly/surprise',
    title: 'Super test',
    author: '1lu4d',
    likes: 359015,
    id: '6a7ed8efe04d4d8c5baac857',
    user: {
      username: 'root',
      id: '6a7ed75b2a222b171fce4233'
    }
  }

  test('renders content which needed to be rendered', () => {
    const { container } = render(<Blog blog={blog} />)
    expect(container).toHaveTextContent('Super test')
    expect(container).toHaveTextContent('1lu4d')
    expect(container).not.toHaveTextContent('https://cs50.ly/surprise')
    expect(container).not.toHaveTextContent('359015')
  })

  test('renders title and author but not url and likes', () => {
    const { container } = render(<Blog blog={blog} />)

    expect(container).toHaveTextContent('Super test')
    expect(container).toHaveTextContent('1lu4d')

    expect(container).not.toHaveTextContent('https://cs50.ly/surprise')
    expect(container).not.toHaveTextContent('359015')
  })

  test('renders url and likes when button clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} />)

    const button = screen.getByText('view')
    await user.click(button)

    expect(container).toHaveTextContent('https://cs50.ly/surprise')
    expect(container).toHaveTextContent('359015')
  })

  test('calls handleLike twice when like button clicked twice', async () => {
    const mockHandleLike = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} handleLike={mockHandleLike} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

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

    render(<CreateForm CreateBlog={mockCreateBlog} />)

    // Find inputs by their placeholder or label text
    const titleInput = screen.getByPlaceholderText('type title')
    const authorInput = screen.getByPlaceholderText('type author')
    const urlInput = screen.getByPlaceholderText('type url')

    // Type in the form fields
    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://test.com')

    // Submit the form
    const submitButton = screen.getByText('Create')
    await user.click(submitButton)

    // Verify the mock was called with correct data
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://test.com'
    })
  })
})
