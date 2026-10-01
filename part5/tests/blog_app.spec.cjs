const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const reset = await request.post('http://localhost:3003/api/testing/reset')
    expect(reset.ok()).toBeTruthy()
    const createUser = await request.post('http://localhost:3003/api/users', {
      data: { username: 'root', password: 'root' }
    })
    expect(createUser.ok()).toBeTruthy()
    await page.goto('http://localhost:5173')
  })

  const loginViaUI = async (page, username = 'root', password = 'root') => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlogViaAPI = async (request, { title, author, url }) => {
    const loginRes = await request.post('http://localhost:3003/api/login', {
      data: { username: 'root', password: 'root' }
    })
    const { token } = await loginRes.json()

    const blogRes = await request.post('http://localhost:3003/api/blogs', {
      data: { title, author, url },
      headers: { Authorization: `Bearer ${token}` }
    })
    return await blogRes.json()
  }

  test('login page can be opened', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginViaUI(page)
      await expect(page.getByRole('button', { name: /logoff/i })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginViaUI(page, 'root', 'wrong')
      await expect(page.getByText(/wrong credentials/i)).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginViaUI(page)
      await expect(page.getByRole('button', { name: /logoff/i })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('http://localhost:5173/create')

      await page.getByPlaceholder('type title').fill("Dingus's adventure")
      await page.getByPlaceholder('type author').fill('Not Dingus')
      await page.getByPlaceholder('type url').fill('dingusadventure.net')
      await page.getByRole('button', { name: 'Create' }).click()

      await expect(page).toHaveURL(/localhost:5173\/?$/)
      await expect(
        page.getByRole('link', { name: "Dingus's adventure" })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page, request }) => {
      const blog = await createBlogViaAPI(request, {
        title: 'Liked blog',
        author: 'Liker',
        url: 'like.me'
      })

      await page.goto(`http://localhost:5173/blogs/${blog.id}`)
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page, request }) => {
      const blog = await createBlogViaAPI(request, {
        title: 'Doomed blog',
        author: 'Doomed Author',
        url: 'doomed.example'
      })

      await page.goto(`http://localhost:5173/blogs/${blog.id}`)
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'Remove' }).click()
      await page.getByRole('button', { name: 'Yes' }).click()

      await expect(page).toHaveURL(/localhost:5173\/?$/)
      await expect(page.locator(`a[href="/blogs/${blog.id}"]`)).toHaveCount(0)
    })
  })
})
