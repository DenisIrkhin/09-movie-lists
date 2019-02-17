const express = require('express')
const router = express.Router()
const getUserIdByCookies = require('../functions')
const getUserIdByCookiesWithErrors = require('../functions')

// Declare globally to asign later in promises
let dbo

// Array of errors to return
let errors = {}

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
  console.log('Mongodb connected from lists')
}, 500)

// Insert new lists into our database
//
router.post('/add', async (req, res) => {
  errors = {}
  console.log('*******************************************')
  console.log('req.body from post. /lists/add ', req.body)
  console.log('All Cookies: ', req.cookies)

  let email = ''

  try {
    // Get user' eamil by cookie
    email = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('email 40', email)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(404).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create new list and save it in dbo
  let { name, movieArr } = req.body
  const newList = { name, movieArr, user: email }
  console.log('newList', newList)
  dbo
    .collection('lists')
    .insertOne(newList, (err, result) => {
      // console.log('Inside inserting84', err, result)
      if (err) throw err
      // console.log('Success inserting One')
      return res.status(200).json({ success: true, message: 'list added' })
    })
})

// Get user docs from `lists` collection
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from get. /lists/ ', req.body)
  console.log('All Cookies: ', req.cookies)

  let email = ''

  try {
    // Get user' eamil by cookie
    email = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('email 71', email)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(404).json({ success: false, message: `Can't define user`, error: err.message })
  }

  dbo
    .collection('lists')
    .find({ user: email })
    .toArray((err, lists) => {
      if (err) throw err
      console.log('lists', lists)
      return res.status(200).json({ success: true, lists })
    })
    // .catch(err => console.log(err))
})

module.exports = router
