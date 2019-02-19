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
    console.log('err43 when resolving getUserIdByCookies', err)
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
    console.log('userId 72', userId)
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

// Update one user's list. Check for sessionId(user) first
router.put('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from put. /lists/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  try {
    // Get user' email by cookie
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 71', userId)
  } catch (err) {
    console.log('err103 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create updated list from req.body for future saving it in dbo
  let { listId, name, movieArr, description, tags } = req.body
  const updatedList = { userId, name, movieArr, description, tags }
  console.log('updatedList', updatedList)

  // Search for id and that userId of list maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo does NOT throw err but return result with result.value = null
  // We handle this
  try {
    let result = await (dbo.collection('lists').findOneAndUpdate(
      { $and: [{ _id: ObjectID(listId) }, { userId }] },
      // { _id: ObjectID(listId) },
      { $set: updatedList },
      { returnOriginal: false }
    ))
    console.log('result', result)
    console.log('result.value', result.value)
    if (result.value === null) {
      return res.status(400).json({ success: false, message: `You don't have right to change that list` })
    }
    return res.status(200).json({ success: true, message: `List updated`, list: result.value })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Delete one user's list. Check for sessionId(user) first
router.delete('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from delete. /lists/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  let { listId } = req.body

  // Get user' eamil by cookie
  try {
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 71', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Search for id and that userId of list maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo throw err with result.deletedCount = 0
  // We handle this
  try {
    let result = await (dbo.collection('lists').deleteOne(
      { $and: [{ _id: ObjectID(listId) }, { userId }] }
    ))
    // console.log('result', result)
    console.log('result.deletedCount', result.deletedCount)
    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: `You don't have right to delete that list` })
    }
    return res.status(200).json({ success: true, message: `List deleted` })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get list by list id. Does NOT check for user.
router.post('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /lists/id ', req.body)
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

// Get list by wildcard search. Does NOT check for user.
router.post('/wildsearch', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /lists/wildsearch ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let { search } = req.body
  console.log('search ', search)

  try {
    let lists = await (dbo.collection('lists').find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }).toArray())
    console.log('lists', lists)
    return res.status(200).json({ success: true, lists })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

module.exports = router
