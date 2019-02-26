const Validator = require('validator')
const isEmpty = require('../lib/is-empty')

module.exports = function validateLoginInput (data) {
  let valErrors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  if (!Validator.isEmail(data.email)) {
    valErrors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.email)) {
    valErrors.email = 'Email field is required'
  }

  if (Validator.isEmpty(data.password)) {
    valErrors.password = 'Password field is required'
  }

  return {
    valErrors,
    isValid: isEmpty(valErrors)
  }
}
