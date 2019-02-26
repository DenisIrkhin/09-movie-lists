const express = require('express')
const router = express.Router()
const getUserIdByCookiesWithErrors = require('../../lib/cookie')

// Bring User modeil
const User = require('../../models/User')

// Bring stripe library and set TEST key of Denis' account
const stripe = require('stripe')('sk_test_3WWDihsp6zRR9AWb2PHnfhZm')

// Since there is no simple way to transfer amount and currency data from from front to back by hitting endpoint by React StripeCheckout component we implenet two separate endpoint to handle two different membership plans

// Insert new lists into our database
// @@ POST /api/pmnts/pro
router.post('/pro', async (req, res) => {
  // errors = {}
  console.log('*******************************************')
  console.log('req.body from POST /pmnts ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId, user

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 44', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // UserId found by cookie
  // Bring more fields from `users` collection
  try {
    user = await (User.findById(userId))
    // console.log('user 54', user)
  } catch (error) {
    console.log('error ', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
  // Take out fields we need from user obj
  let { email } = user

  // User defined and email defined(optional). Let's proceed to a charge

  // Create charge
  let amount = 3500

  try {
    let customer = await (stripe.customers.create({
      email: req.body.email,
      source: req.body.id
    }))
    let charge = await (stripe.charges.create({
      amount,
      description: 'Pro Member',
      currency: 'CAD',
      customer: customer.id
    }))
    console.log('charge106', charge)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: `Operation declined by Stripe`, error: error.message })
  }

  // Every operation before is succeded. Let's response
  return res.status(200).json({ success: true, message: 'user found', email })
})

// Insert new lists into our database
// @@ POST /api/pmnts/premium
router.post('/premium', async (req, res) => {
  // errors = {}
  console.log('*******************************************')
  console.log('req.body from POST /premium ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId, user

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 44', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    // We return as partial success to avoid catch by browser and throw err without context
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // UserId found by cookie
  // Bring more fields from `users` collection
  try {
    user = await (User.findById(userId))
    // console.log('user 54', user)
  } catch (error) {
    console.log('error ', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
  // Take out fields we need from user obj
  let { email } = user

  // User defined and email defined(optional). Let's proceed to a charge

  // Create charge
  let amount = 4900

  try {
    let customer = await (stripe.customers.create({
      email: req.body.email,
      source: req.body.id
    }))
    let charge = await (stripe.charges.create({
      amount,
      description: 'Premium Member',
      currency: 'CAD',
      customer: customer.id
    }))
    console.log('charge106', charge)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: `Operation declined by Stripe`, error: error.message })
  }

  // Every operation before is succeded. Let's response
  return res.status(200).json({ success: true, message: 'user found', email })
})

module.exports = router
