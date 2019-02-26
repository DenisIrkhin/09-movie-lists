const express = require('express')
const router = express.Router()
const passport = require('passport')

// Bring functions
const getUserIdByCookiesWithErrors = require('../../lib/cookie')

// Bring validation rules
const validateProfile = require('../../validation/profile')

// Load Profile and User models
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// Get user profile
// @@ GET /api/profiles/
// @@ Pivate
router.get('/', async (req, res) => {
  let errors = {}
  let profile, userId

  console.log('******************************************')
  console.log('req.body for GET. /profiles/', req.body)

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 165', userId)
  } catch (error) {
    console.log('err29 when resolving getUserIdByCookies', error)
    errors.user = `Can't define user`
    return res.status(400).json({ success: false, errors })
  }

  // UserId found by cookie

  // Find user's profile
  try {
    profile = await (Profile.findOne({ userId }).populate('user', ['email', 'avatar']))
    console.log('profile 37', profile)
  } catch (error) {
    console.log('error ', error)
    errors.general = 'Something goes wrong'
    return res.status(400).json({ success: false, errors })
  }

  if (!profile) {
    errors.profile = 'There is no profile for this user'
    return res.status(400).json({ success: false, errors })
  }

  // Profile found. Let's return it
  return res.status(200).json({ success: true, message: 'Profile Found', profile })
}
)

// Add and update user profile
// @@ POST /api/profiles
// @@ Pivate
router.post('/', async (req, res) => {
  console.log('******************************************')
  console.log('req.body for POST. /profiles', req.body)

  let errors = {}
  let profile, userId

  // Validate input
  const { valErrors, isValid } = validateProfile(req.body)

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json({ success: false, valErrors })
  }

  try {
    // Get userId by cookie
    userId = await getUserIdByCookiesWithErrors(req.cookies)
    console.log('userId 165', userId)
  } catch (error) {
    console.log('err29 when resolving getUserIdByCookies', error)
    errors.user = `Can't define user`
    return res.status(400).json({ success: false, errors })
  }

  // UserId found by cookie
  // Get fields
  const profileFields = {}
  profileFields.userId = userId
  if (req.body.username) profileFields.username = req.body.username
  if (req.body.website) profileFields.website = req.body.website
  if (req.body.status) profileFields.status = req.body.status
  if (typeof req.body.hobbies !== 'undefined') {
    profileFields.hobbies = req.body.hobbies.split(',')
  }
  if (req.body.bio) profileFields.bio = req.body.bio
  // Social obj fields
  profileFields.social = {}
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  try {
    profile = await (Profile.findOne({ userId }))
    console.log('profile 107', profile)
  } catch (error) {
    console.log('error ', error)
    errors.general = 'Something goes wrong'
    return res.status(400).json({ success: false, errors })
  }

  console.log('profile 114', profile)
  // Check if profile found
  if (profile) {
    // Update profile
    try {
      let result = await (Profile.findOneAndUpdate(
        { userId },
        { $set: profileFields },
        { new: true }
      ))
      console.log('result', result)
      return res.status(200).json({ success: true, message: 'Profile updated' })
    } catch (error) {
      console.log('error ', error)
      errors.general = 'Something goes wrong'
      return res.status(400).json({ success: false, errors })
    }
  } else {
    // Check if username exists
    try {
      profile = await (
        Profile.findOne({ username: profileFields.username })
      )
    } catch (error) {
      console.log('error ', error)
      errors.general = 'Something goes wrong'
      return res.status(400).json({ success: false, errors })
    }
    if (profile) {
      errors.username = 'That username already exists'
      return res.status(400).json({ success: false, errors })
    }

    // Save Profile
    profile = await (Profile(profileFields).save())
    return res.status(200).json({ success: true, message: 'Profile created' })
  }
})

// Get All profiles
// @@ GET /api/profiles/all
// @access  Public
router.get('/all', async (req, res) => {
  const errors = {}

  try {
    let profiles = await (Profile.find()
      .populate('user', ['email', 'avatar']))
    if (!profiles) {
      errors.noprofile = 'There are no profiles'
      return res.status(404).json({ success: false, errors })
    }
    console.log('profiles', profiles)
    return res.status(200).json({ success: true, profiles })
  } catch (error) {
    console.log('error', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
})

// Search profiles by username
// @@ POST /api/profiles/username
// @access  Public

router.post('/username', async (req, res) => {
  const errors = {}

  let { username } = req

  try {
    let profiles = await (Profile.find({ username })
      .populate('user', ['email', 'avatar']))
    if (!profiles) {
      errors.noprofile = 'There are no profiles'
      return res.status(404).json({ success: false, errors })
    }
    return res.status(200).json({ success: true, profiles })
  } catch (error) {
    console.log('error', error)
    return res.status(400).json({ success: false, message: 'Something goes wrong', error })
  }
})

// TODO: JWT should be in cookie
// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let result = await (Profile.findOneAndRemove({ userId: req.user._id }))
    console.log('result', result)
    result = await (User.findOneAndRemove({ _id: req.user._id }))
    console.log('reslut', result)
    res.status(200).json({ success: true, message: 'Profile deleted. User deleted' })
  })

module.exports = router
