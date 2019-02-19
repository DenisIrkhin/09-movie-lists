const MongoClient = require('mongodb').MongoClient

// MLab import from separate file for security reason also.
const url = require('./config/param').mongoURL
// console.log('url', url)

let gdbo = new Promise((resolve, reject) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    //   //   debugger
    if (err) reject(err)
    resolve(db.db('ml'))
    //   // console.log('dbo is ', dbo)
  })
})

module.exports = gdbo
