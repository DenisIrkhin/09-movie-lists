const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  username: {
    type: String,
    required: true,
    max: 40
  },
  website: {
    type: String
  },
  status: {
    type: String
  },
  hobbies: {
    type: [String]
  },
  bio: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Allows populate userId to user odj (sort of renaming userId to user)
ProfileSchema.virtual('user', {
  localField: 'userId',
  foreignField: '_id',
  ref: 'users',
  justOne: true // populate one doc only. with false it populates an array
})

// ProfileSchema.set('toObject', { virtuals: true })

// That setting is crucial to have output with find()
ProfileSchema.set('toJSON', { virtuals: true })

module.exports = Profile = mongoose.model('profile', ProfileSchema)
