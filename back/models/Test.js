const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
// Mongo stors time in UTC. We leave as is because in real app we need deliver time zone from front and convert UTC to it by using `moment-timezone.js`
const TestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Test = mongoose.model('tests', TestSchema)
module.exports = Test
