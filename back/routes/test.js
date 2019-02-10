const express = require('express')
const router = express.Router()
// Declare globally to asign later in promises
let dbo

// brin Async func
// declare global to assign value in promise resolve
const gdbo = require('../mongo-dbo-promise')
gdbo.then(res => {
  // console.log('Inside promise resolve is', res)
  dbo = res
})

// To check it
setTimeout(() => {
  if (dbo !== undefined) {
  }
  console.log('Mongodb connected')
}, 500)

// Here we will insert new posts into our database
// when we send back our response, we can send it
// in this format:
// {success: true, message:'review added'}
// request is
// { username: 'dan', review: 'My rewiew', rating: '5' }
router.post('/add', (req, res) => {
  // console.log(req.body)

  // don't need this step because we use app.use(bodyParser.json())
  // let review = JSON.parse(req.body)

  // Here object from async func
  dbo.collection('tests').insertOne(req.body, (err, result) => {
    if (err) throw err
    // console.log('Success inserting One')
    res.status(200).json({ success: true, message: 'test added' })
  })
})

// Get all docs from tests collections
router.get('/', (req, res) => {
  // console.log('request for get. /review ', req)
  dbo
    .collection('tests')
    .find({})
    .toArray((err, result) => {
      if (err) throw err
      // console.log('Getting all test', result)
      res.status(200).json({ success: true, tests: result })
    })
})

module.exports = router
