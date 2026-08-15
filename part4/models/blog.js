const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const formattedBlog = {
      url: returnedObject.url,
      title: returnedObject.title,
      author: returnedObject.author,
      likes: returnedObject.likes,
      id: returnedObject._id.toString()
    }
    if (returnedObject.user) {
      formattedBlog.user = returnedObject.user
    }

    return formattedBlog
  }
})

module.exports = mongoose.model('Blog', blogSchema)
