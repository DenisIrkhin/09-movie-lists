const Validator = require('validator')
const isEmpty = require('../lib/is-empty')

module.exports = function validateProfile (data) {
  let valErrors = {}

  data.username = !isEmpty(data.username) ? data.username : ''

  if (!Validator.isLength(data.username, { min: 2, max: 10 })) {
    valErrors.username = 'username needs to be between 2 and 10 characters'
  }

  if (Validator.isEmpty(data.username)) {
    valErrors.username = 'Profile username is required'
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      valErrors.website = 'Not a valid URL'
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      valErrors.youtube = 'Not a valid URL'
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      valErrors.twitter = 'Not a valid URL'
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      valErrors.facebook = 'Not a valid URL'
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      valErrors.linkedin = 'Not a valid URL'
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      valErrors.instagram = 'Not a valid URL'
    }
  }

  return {
    valErrors,
    isValid: isEmpty(valErrors)
  }
}
