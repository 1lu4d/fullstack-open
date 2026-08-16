const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'Dingus',
        password: '123'
      }
    })
    await page.goto('http://localhost:5173')
  })
  test('front page can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    const username = page.getByLabel('username')
    const password = page.getByLabel('password')
    await expect(username, password).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('Dingus')
      await page.getByLabel('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Logged in as Dingus').first()).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('Dingus')
      await page.getByLabel('password').fill('124')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'Dingus',
          password: '123'
        }
      })

      await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('Dingus')
      await page.getByLabel('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as Dingus').first()).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title: ').fill("Dingus's adventure")
      await page.getByLabel('author: ').fill('Not Dingus')
      await page.getByLabel('url: ').fill('dingusadventure.net.xyz.onion')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(
        page.getByText("Dingus's adventure Not Dingus")
      ).toBeVisible()
    })
  })

  describe('When logged it and one blog exists', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'Dingus',
          password: '123'
        }
      })

      await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('Dingus')
      await page.getByLabel('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as').first()).toBeVisible()

      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title: ').fill("Dingus's adventure")
      await page.getByLabel('author: ').fill('Not Dingus')
      await page.getByLabel('url: ').fill('dingusadventure.net.xyz.onion')
      await page.getByRole('button', { name: 'Create' }).click()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('User who added blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'Remove' }).click()

      await expect(
        page.getByText('Remove blog "Dingus\'s adventure" by Not Dingus?')
      ).toBeVisible()

      await page.getByRole('button', { name: 'Yes' }).click()

      await expect(
        page.getByText('Removed "Dingus\'s adventure"')
      ).toBeVisible()
      await expect(page.getByText("Dingus's adventure Not Dingus")).toBeHidden()
    })
    test('Only user who added blog can delete it', async ({
      page,
      request
    }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'Dingus2',
          password: '123'
        }
      })
      await page.getByRole('button', { name: 'Logoff' }).click()
      await page.getByLabel('username').fill('Dingus2')
      await page.getByLabel('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'Remove' }).first().click()
      await page.getByRole('button', { name: 'Yes' }).click()

      await expect(
        page.getByText(/Failed to delete Dingus's adventure/i)
      ).toBeVisible({ timeout: 10000 })
    })
  })
  describe('sorting blogs by likes', () => {
    beforeEach(async ({ request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
    })
    test('blogs are arranged in order of likes, most likes first', async ({
      page,
      request
    }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'Dingus',
          password: '123'
        }
      })

      // Логинимся через API для получения токена
      const loginResponse = await request.post(
        'http://localhost:3003/api/login',
        {
          data: {
            username: 'Dingus',
            password: '123'
          }
        }
      )
      const loginData = await loginResponse.json()
      const token = loginData.token

      const blogs = [
        {
          title: 'Blog with least likes',
          author: 'Author 1',
          url: 'http://least.com',
          likes: 1
        },
        {
          title: 'Blog with most likes',
          author: 'Author 2',
          url: 'http://most.com',
          likes: 3
        },
        {
          title: 'Blog with medium likes',
          author: 'Author 3',
          url: 'http://medium.com',
          likes: 2
        }
      ]

      for (const blog of blogs) {
        await request.post('http://localhost:3003/api/blogs', {
          data: blog,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('Dingus')
      await page.getByLabel('password').fill('123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Logged in as Dingus').first()).toBeVisible()

      const blogElements = await page.locator('.blog').all()
      const titles = []

      for (const element of blogElements) {
        const text = await element.textContent()
        if (text.includes('Blog with most likes'))
          titles.push('Blog with most likes')
        else if (text.includes('Blog with medium likes'))
          titles.push('Blog with medium likes')
        else if (text.includes('Blog with least likes'))
          titles.push('Blog with least likes')
      }
      console.log(titles)

      expect(titles).toEqual([
        'Blog with most likes',
        'Blog with medium likes',
        'Blog with least likes'
      ])
    })
  })
})
