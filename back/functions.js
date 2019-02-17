// Returns email by cookies
// Function never throws error.
// Always returns object of two objects
// {
//  errors,
//  email
// }
// Errors is an object of errors
// Email is email of user found by cookie through sessions collections
// If email is not found then return email: ''
module.exports = function getUserIdByCookies (dbo, cookies = {}) {
  let errors = {}
  let email = ''
  let repObj = {
    errors,
    email
  }
  // Get our cookie from all cookies
  let mlCookie = (cookies.__sid__).toString()
  console.log('mlCookie: 20 ', mlCookie)
  if (mlCookie === undefined) {
    errors.cookie = "Can't get cookie and define a user"
    // console.log('errors', errors)

    // To be consistent we need return an error through promise
    return new Promise((resolve, reject) => resolve(repObj))
  } else {
    // Find userId by session id
    return (
      dbo
        .collection('sessions')
        .findOne({ sessionId: mlCookie })
        .then(res => {
          console.log('result from functions.js', res)
          if (res === null) {
            // Can't find sessionid in sessions collection.
            errors.user = `Can't find sessionid in sessions collection`
            // return repObj
            throw new Error(`Can't find sessionid in sessions collection`)
          } else {
            repObj.email = res.email
            // console.log('email', email)
            // console.log('repObj', repObj)
            return repObj
          }
        })
        .catch(err => {
          errors.general = err
          // return repObj
          console.log('err 40 inside functons.js')
          throw new Error(err)
        })
    )
  }
}

// Another approach to throw errors to catch them in calling function on catch branch
// Returns email by cookies
// Retruns string email or throw Error object
module.exports = function getUserIdByCookiesWithErrors (dbo, cookies = {}) {
  // Get our cookie from all cookies
  let mlCookie = (cookies.__sid__).toString()
  console.log('mlCookie: 60 ', mlCookie)
  if (mlCookie === undefined) {
    // errors.cookie = "Can't get cookie and define a user"
    // console.log('errors', errors)

    // To be consistent we need return an error through promise
    return new Promise((resolve, reject) => reject(new Error(`Can't get cookie and define a user`)))
  } else {
    // Find userId by session id
    return (
      dbo
        .collection('sessions')
        .findOne({ sessionId: mlCookie })
        .then(res => {
          console.log('result from functions.js', res)
          if (res === null) {
            // Can't find sessionid in sessions collection.
            throw new Error(`Can't find sessionid in sessions collection`)
          } else {
            // Find doc in sessions collections and return user's email from it
            return res.email
          }
        })
        .catch(err => {
          // Catch errors general from MongoDB execution and from query Promise resolving
          console.log('err 83 inside functons.js')

          // Rethrow err to callting func
          throw err
        })
    )
  }
}
