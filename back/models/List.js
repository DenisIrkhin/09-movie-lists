const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String
  },
  movieArr: [
    {
      vote_count: {
        type: Number
      },
      id: {
        type: Number,
        required: true
      },
      video: {
        type: Boolean
      },
      vote_average: {
        type: 'Decimal128',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      popularity: {
        type: 'Decimal128'
      },
      poster_path: {
        type: String
      },
      original_language: {
        type: String
      },
      original_title: {
        type: String
      },
      genre_ids: {
        type: [Number]
      },
      backdrop_path: {
        type: String
      },
      adult: {
        type: Boolean
      },
      overview: {
        type: String
      },
      release_date: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = List = mongoose.model('list', ListSchema)
