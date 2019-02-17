const express = require('express')
const router = express.Router()
// Declare globally to asign later in promises
let dbo

// Array of errors to return
let errors = {}

// Session id generator to a digit from 10mln to 99,999mln
const sessionIdGenerator = () => Math.floor(Math.random() * 100000000 + 10000000).toString()

// bring Async func
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
  console.log('Mongodb connected from users.js')
}, 500)

// Here we will insert new users into our `users` collection
router.post('/signup', async (req, res) => {
  errors = {}
  let emailExists, userId
  console.log('******************************************')
  console.log('req.body for post. /users/signup', req.body)

  // Check if email exists
  let { email } = req.body
  try {
    emailExists = await (dbo.collection('users').findOne({ email }))
  } catch (error) {
    console.log(error)
  }

  // Check if email found
  if (emailExists) {
    errors.email = 'Email already exist'
    console.log('errors', errors)
    return res.status(404).json({ success: false, errors })
  } else {
    // Create new user and new sessionId
    // NOTE: userId is an object includs ObjectID in mLab we see it like
    //  "_id": {
    // "$oid": "5c68c24270bc1e9054488bc3"
    // }
    try {
      let result = await (dbo.collection('users').insertOne(req.body))
      userId = result.ops[0]._id
      console.log('type of userId', typeof userId)
      console.log('User added to users collection')
    } catch (error) {
      console.log(error)
    }

    // Create session id and save it to dbo
    let sessionId = sessionIdGenerator()

    // Email just for simplify human readability of dbo
    let sessionElem = { userId, sessionId, email }
    try {
      let result = await (dbo.collection('sessions').insertOne(sessionElem))
      console.log('new session doc added', result.ops[0])
      res.cookie('__sid__', `${sessionId}`)
      // return res.status(200).json({ success: true, message: 'Logged in successfully' })
    } catch (error) {
      console.log(error)
    }

    // // Devs Only. Search session by userId
    // try {
    //   let findUser = await (dbo.collection('sessions').findOne({ userId }))
    //   console.log('findUser', findUser)
    //   return res.status(200).json({ findUser })
    // } catch (error) {
    //   console.log(error)
    // }
  }
}
)

// Here we will authentificate users with passwords
// If good authentificated then session id will be created
router.post('/login', async (req, res) => {
  errors = {}
  let user, userId

  console.log('******************************************')
  console.log('req.body for post. /users/login', req.body)

  let { email, password } = req.body

  // Find user by email and get userId from it
  // NOTE: userId is an object includs ObjectID in mLab we see it like
  //  "_id": {
  // "$oid": "5c68c24270bc1e9054488bc3"
  // }
  try {
    user = await (dbo.collection('users').findOne({ email }))
    console.log('user is ', user)
    userId = user._id
    console.log('userId is ', userId)
  } catch (error) {
    console.log(error)
  }

  if (!user) {
    errors.email = 'Email not found'
    console.log('errors', errors)
    return res.status(404).json({ success: false, errors })
  } else if (user.password !== password) {
    errors.password = 'Incorrect password'
    console.log('errors', errors)
    return res.status(404).json({ success: false, errors })
  } else {
    // User authentificated.
    console.log('User authentificated')

    // Create session id and save it to dbo
    let sessionId = sessionIdGenerator()
    let sessionElem = { userId, sessionId, email }
    try {
      let result = await (dbo.collection('sessions').insertOne(sessionElem))
      console.log('new session doc added', result.ops[0])
      res.cookie('__sid__', `${sessionId}`)
      return res.status(200).json({ success: true, message: 'Logged in successfully' })
    } catch (error) {
      console.log(error)
    }
  }
}
)

// Get all users from `users` collection
router.get('/', async (req, res) => {
  console.log('******************************************')
  console.log('req.body for get. /users/ ', req.body)

  try {
    let result = await (dbo.collection('users').find({}).toArray())
    return res.status(200).json({ success: true, users: result })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
