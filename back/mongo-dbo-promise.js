const MongoClient = require('mongodb').MongoClient

// MLab import from separate file for security reason also.
// AWS does NOT work for any version
// const uri = require('./config/param').MONGO_ATLAS_AWS_36

// Google the most stable of three even with v3.6+
// const uri = require('./config/param').MONGO_ATLAS_GOOGLE_34

// Works fine
// const uri = require('./config/param').MONGO_ATLAS_AZURE_34
// Does NOT work stable
// const uri = require('./config/param').MONGO_ATLAS_AZURE_36

const uri = require('./config/param').MONGO_DO
console.log('Mongo', uri)

let gdbo = new Promise((resolve, reject) => {
  MongoClient.connect(uri, { useNewUrlParser: true }, (err, db) => {
    if (err) reject(err)
    resolve(db.db('ml'))
    //   // console.log('dbo is ', dbo)
  })
})

module.exports = gdbo
