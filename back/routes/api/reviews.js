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
  console.log('Mongodb connected from reviews.js')
}, 500)

// Add new review
// @@ POST /api/reviews
router.post('/', async (req, res) => {
  errors = {}
  console.log('*******************************************')
  console.log('req.body from POST. /reviews ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId, user

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 40', userId)
  } catch (err) {
    console.log('err43 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // UserId found by cookie
  // Bring more fields from `users` collection
  try {
    user = await (dbo.collection('users').findOne({ _id: userId }))
    console.log('user 175', user)
  } catch (error) {
    console.log('error ', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
  const { email } = user

  // Create new review
  const { movieId, reviewText } = req.body
  const newReview = { userId, email, movieId, reviewText }
  console.log('newReview', newReview)
  try {
    let result = await (dbo.collection('reviews').insertOne(newReview))
    console.log('review added', result.ops[0])
    return res.status(200).json({ success: true, message: 'review added' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get All user's reviews
// @@ GET /api/reviews
router.get('/', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from GET. /reviews/ ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId = ''

  // Get userId by cookie
  try {
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 84', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // User found
  // Find users' reviews by userId
  try {
    let reviews = await (dbo.collection('reviews').find({ userId }).toArray())
    console.log('reviews', reviews)
    return res.status(200).json({ success: true, reviews })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Update one user's review. Check for sessionId(user) first
// @@ PUT /api/reviews/id
router.put('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from PUT. /reviews/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId

  // Get userId by cookie
  try {
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 114', userId)
  } catch (err) {
    console.log('err116 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Create updated review from req.body for future saving it in dbo
  const { reviewId, movieId, reviewText } = req.body
  const updatedReview = { userId, movieId, reviewText }
  console.log('updatedReview', updatedReview)

  // Search for id and that userId of review maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo does NOT throw err but return result with result.value = null
  // We handle this
  // NOTE: { returnOriginal: false } is MongoClient implementation.
  // In mongoose we can try { new: true}
  // in MongoDocs {returnNewDocument : true }
  try {
    let result = await (dbo.collection('reviews').findOneAndUpdate(
      { $and: [{ _id: ObjectID(reviewId) }, { userId }] },
      // { _id: ObjectID(reviewId) },
      { $set: updatedReview },
      { returnOriginal: false }
    ))
    console.log('result', result)
    console.log('result.value', result.value)
    if (result.value === null) {
      return res.status(400).json({ success: false, message: `You don't have right to change that review` })
    }
    return res.status(200).json({ success: true, message: `Review updated`, review: result.value })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Delete one user's review. Check for sessionId(user) first
// @@ DELETE /api/reviews/id
router.delete('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from DELETE. /reviews/id ', req.body)
  console.log('All Cookies: ', req.cookies)

  let userId

  let { reviewId } = req.body

  // Get user' eamil by cookie
  try {
    userId = await getUserIdByCookiesWithErrors(dbo, req.cookies)
    console.log('userId 165', userId)
  } catch (err) {
    console.log('err64 when resolving getUserIdByCookies', err)
    return res.status(400).json({ success: false, message: `Can't define user`, error: err.message })
  }

  // Search for id and that userId of review maches with userId
  // in case filter condition is not true (user does NOT match current user)
  // Mongo throw err with result.deletedCount = 0
  // We handle this
  try {
    let result = await (dbo.collection('reviews').deleteOne(
      { $and: [{ _id: ObjectID(reviewId) }, { userId }] }
    ))
    // console.log('result', result)
    console.log('result.deletedCount', result.deletedCount)
    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: `You don't have right to delete that review` })
    }
    return res.status(200).json({ success: true, message: `Review deleted` })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get review by reviewId. Does NOT check for user.
// @@ POST /api/reviews/id
router.post('/id', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from POST. /reviews/id ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let { reviewId } = req.body
  console.log('reviewId', reviewId)

  try {
    let review = await (dbo.collection('reviews').findOne({ _id: ObjectID(reviewId) }))
    console.log('review', review)
    return res.status(200).json({ success: true, review })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }
})

// Get review by wildcard search through reviewText. Does NOT check for user.
// @@ POST /api/reviews/wildsearch
router.post('/wildsearch', async (req, res) => {
  console.log('*******************************************')
  console.log('req.body from post. /reviews/wildsearch ', req.body)
  // console.log('All Cookies: ', req.cookies)

  let reviews

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
    reviews = await (dbo.collection('reviews').find({
      $or: [
        { reviewText: { $regex: search, $options: 'i' } }
        // { email: { $regex: search, $options: 'i' } }
      ]
    }).toArray())

    console.log('reviews', reviews)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: true, message: `Something goes wrong`, error })
  }

  // Rank reviews.
  // Idea: find intersections between searchArr and each fieldArr
  // We will count intersetion only one time - not many
  // Example. searchArr=[5] doc1=[5,5,5] doc2=[5,5]. Both docs will get rank 1 and not 3 and 2
  // For that we'll use Sets instead of arrays

  let searchSet = new Set(searchArr)
  console.log('searchSet ', searchSet)

  let rankedReviews = reviews.map(review => {
    let searchRank = 0
    let reviewTextSet = new Set(review.reviewText.toLowerCase().split(' '))
    // Need to implement more advanced divider for email
    // let emailSet = new Set(review.email.toLowerCase().split(' '))
    searchRank += new Set([...searchSet].filter(x => reviewTextSet.has(x))).size
    // console.log('searchRank ', searchRank)
    // searchRank += new Set([...searchSet].filter(x => emailSet.has(x))).size
    // console.log('searchRank ', searchRank)
    console.log('searchRank ', searchRank)
    review.searchRank = searchRank
    return review
  })
  console.log('rankedReviews ', rankedReviews)
  let sortedRankedReviews = rankedReviews.sort((a, b) => b.searchRank - a.searchRank)
  console.log('sortedRankedReviews ', sortedRankedReviews)

  return res.status(200).json({ success: true, sortedRankedReviews })
})

module.exports = router
