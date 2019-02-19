const express = require('express')
const router = express.Router()
// Declare globally to asign later in promises
let dbo

// brin Async func
// declare global to assign value in promise resolve
const gdbo = require('../../mongo-dbo-promise')
gdbo.then(res => {
  // console.log('Inside promise resolve is', res)
  dbo = res
})

// To check it
setTimeout(() => {
  if (dbo !== undefined) {
  }
  console.log('Mongodb connected from test.js')
}, 500)

// Here we will insert new posts into our database
// when we send back our response, we can send it
// in this format:
// {success: true, message:'review added'}
// request is
// { username: 'dan', review: 'My rewiew', rating: '5' }
router.post('/add', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body for post. /lists/add ', req.body)

  try {
    let result = await (dbo.collection('tests').insertOne(req.body))
    console.log('result.ops[0]', result.ops[0])
    res.status(200).json({ success: true, message: 'test added', doc: result.ops[0] })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: 'smth goes wrong', error })
  }
})

// Get all docs from tests collections
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body for get. /lists/ ', req.body)

  try {
    let result = await (dbo.collection('tests').find({}).toArray())
    console.log('Getting all test', result)
    res.status(200).json({ success: true, tests: result })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: 'smth goes wrong', error })
  }
})

module.exports = router
