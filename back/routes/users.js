const express = require('express')
const router = express.Router()
// Declare globally to asign later in promises
let dbo

// Array of errors to return
let errors = {}

// Session id generator to a digit from 10mln to 99,999mln
const sessionIdGenerator = () => Math.floor(Math.random() * 100000000 + 10000000)

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
router.post('/signup', (req, res) => {
  errors = {}
  console.log('req.body for post. /users/signup', req.body)

  // Check if email exists
  let { email } = req.body
  dbo
    .collection('users')
    .findOne({ email })
    .then(user => {
      console.log('user', user)
      if (user) {
        errors.email = 'Email already exist'
        console.log('errors', errors)
        return res.status(404).json({ success: false, errors })
      } else {
        // Create new user and new sessioId
        //
        dbo.collection('users').insertOne(req.body, (err, result) => {
          if (err) throw err
          console.log('User added to users collection')

          // Create session id and save it to dbo
          let sessionId = sessionIdGenerator()
          let sessionElem = { email, sessionId }
          dbo
            .collection('sessions')
            .insertOne(sessionElem, (err, result) => {
              if (err) throw err
              console.log('new session doc added', result)
              res.cookie('__sid__', `${sessionId}`)
              res.status(200).json({ success: true, message: 'Logged in successfully' })
            })
        })
      }
    })
})

// Here we will authentificate users with passwords
// If good authentificated then session id will be created
router.post('/login', (req, res) => {
  errors = {}
  console.log('req.body for post. /users/login', req.body)
  let { email, password } = req.body
  // Here object from async func
  // Await for request
  //

  dbo
    .collection('users')
    .findOne({ email })
    .then(user => {
      console.log('user is ', user)
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
        let sessionElem = { email, sessionId }
        dbo
          .collection('sessions')
          .insertOne(sessionElem, (err, result) => {
            if (err) throw err
            console.log('new session doc added', result)
            res.cookie('__sid__', `${sessionId}`)
            res.status(200).json({ success: true, message: 'Logged in successfully' })
          })
      }
    }
    )
})

// Get all docs from `users` collection
router.get('/', (req, res) => {
  console.log('req.body for get. /users/ ', req.body)
  dbo
    .collection('users')
    .find({})
    .toArray((err, result) => {
      if (err) throw err
      // console.log('Getting all test', result)
      res.status(200).json({ success: true, users: result })
    })
})

module.exports = router
