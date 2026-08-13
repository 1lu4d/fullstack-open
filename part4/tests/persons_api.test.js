const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)
describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    // console.log('cleared')

    await Blog.insertMany(helper.blogs)

    // console.log('added')
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.blogs.length)
  })
  test('a specific blog is within the returned blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      _id: '5a422a851b54a676232d14f5',
      title: 'Async/Await Test Blog',
      author: 'John Harvard',
      url: 'https://cs50.ly/surprise',
      likes: 7,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    assert(titles.includes('Async/Await Test Blog'))
  })

  test('blog without content is not added', async () => {
    const newBlog = {
      likes: 69
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map((n) => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.blogs.length - 1)
  })

  test("Blog's unique identifier is named 'id'", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    assert('id' in blogToView)
    assert(!('_id' in blogToView))
  })

  test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'No likes test blog',
      author: 'John Harvard',
      url: 'https://cs50.ly/surprise'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)

    const blogsAtEnd = await helper.blogsInDb()
    const savedBlog = blogsAtEnd.find(
      (blog) => blog.title === 'No likes test blog'
    )
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('blog without title returns 400', async () => {
    const newBlog = {
      author: 'John Harvard',
      url: 'https://cs50.ly/surprise',
      likes: 7
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('blog without url returns 400', async () => {
    const newBlog = {
      title: 'No-url Test Blog',
      author: 'John Harvard',
      likes: 67
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 666
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 666)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 666)
  })

  test('updating a non-existent blog returns 404', async () => {
    const nonExistentId = '000000000000000000000000'

    const updatedData = {
      title: "Doesn't exist",
      author: 'Mr. Nobody',
      url: 'https://thereisnosuchsite.com',
      likes: 0
    }

    await api.put(`/api/blogs/${nonExistentId}`).send(updatedData).expect(404)
  })
})
after(async () => {
  await mongoose.connection.close()
})
