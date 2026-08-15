const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('blogs API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    await Blog.insertMany(helper.blogs)
  })

  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
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

    test("blog's unique identifier is named 'id'", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      assert('id' in blogToView)
      assert(!('_id' in blogToView))
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'Async/Await Test Blog',
        author: 'John Harvard',
        url: 'https://cs50.ly/surprise',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

      const titles = blogsAtEnd.map((n) => n.title)
      assert(titles.includes('Async/Await Test Blog'))
    })

    test("a blog can't be added without token", async () => {
      const newBlog = {
        title: 'Async/Await Test Blog',
        author: 'John Harvard',
        url: 'https://cs50.ly/surprise',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('blog without title returns 400', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        author: 'John Harvard',
        url: 'https://cs50.ly/surprise',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without url returns 400', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'No-url Test Blog',
        author: 'John Harvard',
        likes: 67
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('blog without likes defaults to 0', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'No likes test blog',
        author: 'John Harvard',
        url: 'https://cs50.ly/surprise'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })
    test('blog without content is not added', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        likes: 69
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.blogs.length)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'Blabla-Test',
        author: 'John Harvard',
        url: 'https://cs50.ly/surprise',
        likes: 7
      }

      const blogToDelete = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      await api
        .delete(`/api/blogs/${blogToDelete.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map((n) => n.id)
      assert(!ids.includes(blogToDelete.body.id))
      assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
    })
  })

  describe('PUT /api/blogs/:id', () => {
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
})

describe('users API', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'CoolDingus43',
      name: 'Dingus',
      password: 'root'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salamalekum'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
