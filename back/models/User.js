const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// UserSchema.virtual('profiles', {
//   localField: '_id',
//   foreignField: 'userId',
//   ref: 'profiles'
// })
module.exports = User = mongoose.model('users', UserSchema)
