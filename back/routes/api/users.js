const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcrypt')
const passport = require('passport')

// Bring functions
const getUserIdByCookiesWithErrors = require('../../lib/cookie')
const jwtSign = require('../../lib/jwt-func')

// Bring validation rules
const validateSignup = require('../../validation/signup')
const validateLogin = require('../../validation/login')

// Array of errors to return
let errors = {}

// Session id generator to a digit from 10mln to 99,999mln
const sessionIdGenerator = () => Math.floor(Math.random() * 100000000 + 10000000).toString()

// Load User and Session models
const User = require('../../models/User')
const Session = require('../../models/Session')

// Here we will insert new users into our `users` collection
// @@ POST /api/users/signup
// @@ Public
router.post('/signup', async (req, res) => {
  const { valErrors, isValid } = validateSignup(req.body)

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ success: false, valErrors })
  }
  errors = {}
  let emailExists, userId
  console.log('******************************************')
  console.log('req.body for post. /users/signup', req.body)

  // Check if email exists
  let { email, password } = req.body
  try {
    emailExists = await (User.findOne({ email }))
  } catch (error) {
    console.log(error)
  }

  // Check if email found
  if (emailExists) {
    errors.email = 'Email already exist'
    console.log('errors', errors)
    return res.status(400).json({ success: false, errors })
  } else {
    // Create new user and new sessionId
    // NOTE: userId is an object includs ObjectID in mLab we see it like
    //  "_id": {
    // "$oid": "5c68c24270bc1e9054488bc3"
    // }

    // Find avatar or asign default icon
    const avatar = gravatar.url(email, {
      protocol: 'https', // https
      s: '200', // Size
      r: 'pg', // Rating
      d: 'identicon' // Default image if not found https://en.gravatar.com/site/implement/images/
    }
    )

    // Hash the pass
    const passHashed = await (bcrypt.hash(password, 10))
    // console.log('passHashed', passHashed)

    // Generate new User for saving in dbo
    const newUser = new User({
      email,
      avatar,
      password: passHashed
    })
    // console.log('newUser', newUser)

    try {
      const result = await (newUser.save())
      console.log('result', result)
      userId = result._id
      console.log('User added to users collection')
    } catch (error) {
      console.log(error)
    }

    // Create JWT token
    const payload = { userId, email, avatar }
    const jwtToken = await (jwtSign(payload))

    // Create sessionDd
    const sessionId = sessionIdGenerator()

    // Generate new Session
    // Email just for simplify human readability of dbo
    const sessionElem = new Session({ userId, sessionId, jwtToken, email })

    try {
      const result = await (sessionElem.save())
      console.log('new session doc added', result)
      res.cookie('__sid__', `${sessionId}`)
      return res.status(200).json({ success: true, userId, email, jwtToken, message: 'Logged in successfully' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: 'Something goes wrong', error })
    }
  }
}
)

// Here we will authentificate users with passwords
// If good authentificated then session id will be created
// @@ POST /api/users/login
// @@ Public
router.post('/login', async (req, res) => {
  const { valErrors, isValid } = validateLogin(req.body)

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ success: false, valErrors })
  }

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
    user = await (User.findOne({ email }))
    console.log('user is ', user)
    userId = user._id
    console.log('userId is ', userId)
  } catch (error) {
    console.log(error)
  }

  // Check for User found
  if (!user) {
    errors.email = 'Email not found'
    console.log('errors', errors)
    return res.status(404).json({ success: false, errors })
  }

  // User found

  // Check password
  const isMatch = await (bcrypt.compare(password, user.password))
  if (!isMatch) {
    errors.password = 'Incorrect password'
    console.log('errors', errors)
    return res.status(400).json({ success: false, errors })
  } else {
    // Password matched
    console.log('User authentificated')

    // Take out fields we need from user obj
    let { _id, email, avatar } = user

    // Create JWT token
    const payload = { userId: _id, email, avatar }
    console.log('payload', payload)
    const jwtToken = await (jwtSign(payload))

    // Create sessionId
    const sessionId = sessionIdGenerator()

    // Generate new Session
    // Email just for simplify human readability of dbo
    const sessionElem = new Session({ userId, sessionId, jwtToken, email })

    try {
      const result = await (sessionElem.save())
      console.log('new session doc added', result)
      res.cookie('__sid__', `${sessionId}`)
      return res.status(200).json({ success: true, userId, email, jwtToken, message: 'Logged in successfully' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: 'Something goes wrong', error })
    }
  }
}
)

// Define user by cookie if any.
// If good authentificated then session id will be created
// @@ POST /api/users/check
// @@ Pivate
router.post('/check', async (req, res) => {
  errors = {}
  let user, userId

  console.log('******************************************')
  console.log('req.body for post. /users/check', req.body)

  // NOTE: userId is an object includs ObjectID in mLab we see it like
  //  "_id": {
  // "$oid": "5c68c24270bc1e9054488bc3"
  // }

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 165', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // UserId found by cookie
  // Bring more fields from `users` collection
  try {
    user = await (User.findOne({ _id: userId }))
    console.log('user 175', user)
  } catch (error) {
    console.log('error ', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }

  // Take out fields we need from user obj

  let { _id, email, avatar } = user

  // Create JWT token
  const payload = { userId: _id, email, avatar }
  const jwtToken = await (jwtSign(payload))

  // Create sessionId
  const sessionId = sessionIdGenerator()

  // Generate new Session
  // Email just for simplify human readability of dbo
  const sessionElem = new Session({ userId, sessionId, jwtToken, email })

  try {
    const result = await (sessionElem.save())
    console.log('new session doc added', result)
    res.cookie('__sid__', `${sessionId}`)

    return res.status(200).json({ success: true, userId, email, jwtToken, message: 'Logged in successfully' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
}
)

// FINISH: FOR DEVS ONLY. Comment it before production
// Get all users from `users` collection
// @@ GET /api/users
router.get('/', async (req, res) => {
  console.log('******************************************')
  console.log('req.body for get. /users/ ', req.body)

  try {
    let result = await (User.find({}))
    return res.status(200).json({ success: true, users: result })
  } catch (error) {
    console.log(error)
  }
})

// Get user by userId extracted from JWT
// @@ GET /api/users
// @@ Private
router.post('/id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('******************************************')
  console.log('req.body for get. /users/ ', req.body)

  // try {
  //   let result = await (User.find({}))
  //   return res.status(200).json({ success: true, users: result })
  // } catch (error) {
  //   console.log(error)
  // }
  console.log('req.user', req.user)
  const { _id, email, avatar, password } = req.user

  // Here we use _id because jwt strategy returns pure {user} from mongodb
  // While generating JWT we use userId
  return res.status(200).json({ success: true, userId: _id, email, avatar, password })
})

module.exports = router
