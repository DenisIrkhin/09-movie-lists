const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  movieId: {
    type: Number,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Allows populate userId to user odj (sort of renaming userId to user)
ReviewSchema.virtual('user', {
  localField: 'userId',
  foreignField: '_id',
  ref: 'users',
  justOne: true // populate one doc only. with false it populates an array
})

// This is for console.log
ReviewSchema.set('toObject', { virtuals: true })
// That setting is for response
ReviewSchema.set('toJSON', { virtuals: true })

module.exports = Review = mongoose.model('review', ReviewSchema)
