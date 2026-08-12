const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Group by author and count
  const authorCounts = _.countBy(blogs, 'author')

  // Find author with max blogs
  const topAuthor = _.maxBy(
    _.map(authorCounts, (blogs, author) => ({ author, blogs })),
    'blogs'
  )

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Группируем по автору и суммируем лайки
  const authorLikes = _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes')
    }))
    .value()

  // Находим автора с максимумом лайков
  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
