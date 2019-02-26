const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const SessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  sessionId: {
    type: String,
    required: true
  },
  jwtToken: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Session = mongoose.model('sessions', SessionSchema)
