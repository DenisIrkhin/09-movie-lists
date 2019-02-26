const express = require('express')
const router = express.Router()

// Load Test model
const Test = require('../../models/Test')
// console.log('Test', Test)

// @@ POST /api/tests/add
// Here we will insert new posts into our database
// when we send back our response, we can send it
// in this format:
// {success: true, message:'review added'}
// request is
// { username: 'dan', review: 'My rewiew', rating: '5' }
router.post('/add', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body for POST /tests/add ', req.body)

  const newTest = new Test({
    name: req.body.name,
    surname: req.body.surname
  })

  try {
    const result = await (newTest.save())
    // let result = await (Test.insertOne(req.body))
    console.log('result', result)
    res.status(200).json({ success: true, message: 'test added', doc: result })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: 'smth goes wrong', error })
  }
})

// Get all docs from tests collections
// @@ GET /api/tests
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body for GET /tests ', req.body.name)

  try {
    let result = await (Test.find({}))
    console.log('Getting all test', result)
    res.status(200).json({ success: true, tests: result })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: 'smth goes wrong', error })
  }
})

module.exports = router
