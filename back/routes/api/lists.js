const express = require('express')
const router = express.Router()
const ObjectID = require('mongodb').ObjectID
const getUserIdByCookiesWithErrors = require('../../lib/cookie')

// Bring List model
const List = require('../../models/List')

// Insert new lists into our database
// @@ POST /api/lists/add
router.post('/add', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /lists/add ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 40', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create new list and save it in dbo
  let { name, movieArr, description, tags } = req.body
  const newList = new List({ name, movieArr, userId, description, tags })
  console.log('newList', newList)
  try {
    let result = await (newList.save())
    console.log('list added', result)
    return res.status(200).json({ success: true, message: 'list added' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get All user's lists
// @@ GET /api/lists
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from get. /lists/ ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  try {
    // Get user' eamil by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 72', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  try {
    let lists = await (List.find({ userId }))
    console.log('lists', lists)
    return res.status(200).json({ success: true, lists })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: `Something goes wrong`, error })
  }
})

// Update one user's list. Check for sessionId(user) first
// @@ PUT /api/lists/id
router.put('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from put. /lists/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  try {
    // Get user' email by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 71', userId)
  } catch (err) {
    console.log('err103 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create updated list from req.body for future saving it in dbo
  let { listId, name, movieArr, description, tags } = req.body
  const updatedList = new List({ userId, name, movieArr, description, tags })
  console.log('updatedList', updatedList)

  // Search for id and that userId of list maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo does NOT throw err but return result with result.value = null
  // We handle this
  // NOTE: { returnOriginal: false } is MongoClient implementation.
  // In mongoose we can try { new: true}
  // in MongoDocs {returnNewDocument : true }
  try {
    let result = await (List.findOneAndUpdate(
      { $and: [{ _id: ObjectID(listId) }, { userId }] },
      // { _id: ObjectID(listId) },
      { $set: updatedList },
      { new: true }
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

// Push movieObject to movieArr of several lists. Check for sessionId(user) first
// @@ PUT /api/lists/add-movie
router.put('/add-movie', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from put. /lists/add-movie ', req.body)
  console.log('All Cookies: ', req.cookies)

  let listArrObjectIds = req.body.lists.map(el => {
    console.log(ObjectID(el))
    return ObjectID(el)
  })
  console.log('listArrObjectIds', listArrObjectIds)
  let { movieObject } = req.body
  console.log('movieObject', movieObject)

  let userId = ''

  try {
    // Get user' email by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 71', userId)
  } catch (err) {
    console.log('err103 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Search for id and that userId of list maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo does NOT throw err but return result with result.modifiedCount = 0
  // We handle this
  // NOTE: { returnOriginal: false } is MongoClient implementation.
  // In mongoose we can try { new: true}
  // in MongoDocs {returnNewDocument : true }
  try {
    let result = await (List.updateMany(
      // { $and: [{ _id: ObjectID(listId) }, { userId }] },
      { $and: [{ _id: { $in: listArrObjectIds } }, { userId }] },
      { $push: {
        movieArr: movieObject
      } },
      { new: true }
    ))
    console.log('result', result.result)
    // console.log('result.value', result.value)
    if (result.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: `You don't have right to change that list` })
    }
    return res.status(200).json({ success: true, message: `List updated`, result: result.result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Delete one user's list. Check for sessionId(user) first
// @@ DELETE /api/lists/id
router.delete('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from delete. /lists/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  let { listId } = req.body

  // Get user' eamil by cookie
  try {
    userId = await getUserIdByCookiesWithErrors(req.cookies)
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
    let result = await (List.deleteOne(
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
// @@ POST /api/lists/id
router.post('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /lists/id ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let { listId } = req.body
  console.log('listId', listId)

  try {
    let list = await (List.findById(listId))
    console.log('list', list)
    return res.status(200).json({ success: true, list })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get list by wildcard search. Does NOT check for user.
// @@ POST /api/lists/wildsearch
router.post('/wildsearch', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /lists/wildsearch ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let lists

  let { search } = req.body
  // Example `top 5 sci fi`
  console.log('search ', search)

  // Separate each word of the search string into array
  let searchArr = search.toLowerCase().split(' ')

  // Search string is `top5scifi` for regex search
  search = searchArr.join('|')
  console.log('search', search)

  // Regex search through bdo
  try {
    lists = await (List.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }))

    console.log('lists', lists)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }

  // Rank lists.
  // Idea: find intersections between searchArr and each fieldArr
  // We will count intersetion only one time - not many
  // Example. searchArr=[5] doc1=[5,5,5] doc2=[5,5]. Both docs will get rank 1 and not 3 and 2
  // For that we'll use Sets instead of arrays

  let searchSet = new Set(searchArr)
  console.log('searchSet ', searchSet)

  let rankedLists = lists.map(list => {
    let searchRank = 0
    let nameSet = new Set(list.name.toLowerCase().split(' '))
    let tagsSet = new Set(list.tags.toLowerCase().split(' '))
    let descriptionSet = new Set(list.description.toLowerCase().split(' '))
    searchRank += new Set([...searchSet].filter(x => nameSet.has(x))).size
    // console.log('searchRank ', searchRank)
    searchRank += new Set([...searchSet].filter(x => tagsSet.has(x))).size
    // console.log('searchRank ', searchRank)
    searchRank += new Set([...searchSet].filter(x => descriptionSet.has(x))).size
    console.log('searchRank ', searchRank)
    list.searchRank = searchRank
    return list
  })
  console.log('rankedLists ', rankedLists)
  let sortedRankedLists = rankedLists.sort((a, b) => b.searchRank - a.searchRank)
  console.log('sortedRankedLists ', sortedRankedLists)

  return res.status(200).json({ success: true, sortedRankedLists })
})

module.exports = router
