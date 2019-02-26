const Validator = require('validator')
const isEmpty = require('../lib/is-empty')

module.exports = function validateRegisterInput (data) {
  let valErrors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  // data.password2 = !isEmpty(data.password2) ? data.password2 : ''

  if (Validator.isEmpty(data.email)) {
    valErrors.email = 'Email field is required'
  }

  if (!Validator.isEmail(data.email)) {
    valErrors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.password)) {
    valErrors.password = 'Password field is required'
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    valErrors.password = 'Password must be more than 6 and less than 30 characters'
  }

  // if (Validator.isEmpty(data.password2)) {
  //   valErrors.password2 = 'Confirm Password field is required'
  // }

  // if (!Validator.equals(data.password, data.password2)) {
  //   valErrors.password2 = 'Passwords must match'
  // }

  return {
    valErrors,
    isValid: isEmpty(valErrors)
  }
}
