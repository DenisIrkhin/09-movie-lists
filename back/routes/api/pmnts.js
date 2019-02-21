const express = require('express')
const router = express.Router()
// const ObjectID = require('mongodb').ObjectID
// const getUserIdByCookies = require('../../functions')
const getUserIdByCookiesWithErrors = require('../../functions')

// Bring stripe library and set TEST key of Denis' account
const stripe = require('stripe')('sk_test_3WWDihsp6zRR9AWb2PHnfhZm')

// Declare globally to asign later in promises
let dbo

// Array of errors to return
let errors = {}

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
  console.log('Mongodb connected from lists.js')
}, 500)

// Insert new lists into our database
// @@ POST /api/pmnts
router.post('/', async (req, res) => {
  errors = {}
  console.log('*******************************************')
  console.log('req.body from POST /pmnts ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId, user

  // Create charge
  let amount = 1000

  stripe.customers.create({
    email: req.body.email,
    source: req.body.id
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'CAD',
        customer: customer.id
      }))
    .then(charge => console.log('charge56', charge))

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 44', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // UserId found by cookie
  // Bring more fields from `users` collection
  try {
    user = await (dbo.collection('users').findOne({ _id: userId }))
    console.log('user 54', user)
  } catch (error) {
    console.log('error ', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
  // Take out fields we need from user obj
  let { email } = user
  return res.status(200).json({ success: true, message: 'user found', email })
})

module.exports = router
