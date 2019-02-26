const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  email: {
    type: String,
    required: true
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

module.exports = Review = mongoose.model('review', ReviewSchema)
