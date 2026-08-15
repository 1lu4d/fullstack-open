const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // this ensures the uniqueness of username
    minlength: 3
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    return {
      blogs: returnedObject.blogs,
      username: returnedObject.username,
      name: returnedObject.name,
      id: returnedObject._id.toString()
    }
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
