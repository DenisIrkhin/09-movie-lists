const express = require('express')
const router = express.Router()
const ObjectID = require('mongodb').ObjectID
// const getUserIdByCookies = require('../../functions')
const getUserIdByCookiesWithErrors = require('../../functions')

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
  console.log('Mongodb connected from lists')
}, 500)

// Insert new lists into our database
//
router.post('/add', async (req, res) => {
  errors = {}
  console.log('*******************************************')
  console.log('req.body from post. /lists/add ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 40', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create new list and save it in dbo
  let { name, movieArr, description, tags } = req.body
  const newList = { name, movieArr, userId, description, tags }
  console.log('newList', newList)
  try {
    let result = await (dbo.collection('lists').insertOne(newList))
    console.log('list added', result.ops[0])
    return res.status(200).json({ success: true, message: 'list added' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get All users lists
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from get. /lists/ ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  try {
    // Get user' eamil by cookie
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 71', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  try {
    let lists = await (dbo.collection('lists').find({ userId }).toArray())
    console.log('lists', lists)
    return res.status(200).json({ success: true, lists })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get list by list id. Does NOT check for user.
router.post('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from get. /lists/ ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let { listId } = req.body
  console.log('listId', listId)

  try {
    let list = await (dbo.collection('lists').findOne({ _id: ObjectID(listId) }))
    console.log('list', list)
    return res.status(200).json({ success: true, list })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

module.exports = router
