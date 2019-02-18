// Returns userId by cookies
// Function never throws error.
// Always returns object of two objects
// {
//  errors,
//  userId
// }
// Errors is an object of errors
// userId is userId of user found by cookie through sessions collections
// If userId is not found then return userId: ''
// NOTE: TEST IT before using!
module.exports = async function getUserIdByCookies (dbo, cookies = {}) {
  let errors = {}
  let userId = ''
  let repObj = {
    errors,
    userId
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
    try {
      let res = await (dbo.collection('sessions').findOne({ sessionId: mlCookie }))
      console.log('result from functions.js', res)
      if (res === null) {
      // Can't find sessionid in sessions collection.
        errors.user = `Can't find sessionid in sessions collection`
        return repObj
        // throw new Error(`Can't find sessionid in sessions collection`)
      } else {
        repObj.userId = res.userId
        // console.log('userId', userId)
        // console.log('repObj', repObj)
        return repObj
      }
    } catch (error) {
      console.log(error)
      return repObj
    }
  }
}

// Another approach to throw errors to catch them in calling function on catch branch
// Returns userId by cookies
// Retruns string userId or throw Error object
module.exports = async function getUserIdByCookiesWithErrors (dbo, cookies = {}) {
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

    try {
      let res = await (dbo.collection('sessions').findOne({ sessionId: mlCookie }))
      if (res === null) {
        // Can't find sessionid in sessions collection.
        throw new Error(`Can't find sessionid in sessions collection`)
      } else {
        // Find doc in sessions collections and return user's userId from it
        return res.userId
      }
    } catch (error) {
      // Catch errors general from MongoDB execution and from query Promise resolving
      console.log('err 83 inside functons.js', error)

      // Rethrow err to callting func
      throw error
    }
  }
}
